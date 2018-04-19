import { mergeMap } from "rxjs/operators/mergeMap";
import { map } from "rxjs/operators/map";
import { delay } from "rxjs/operators/delay";

import { withLatestFrom } from "rxjs/operators/withLatestFrom";
import { catchError } from "rxjs/operators/catchError";

import { Observable } from "rxjs/Observable";
import { Action, Store, select } from "@ngrx/store";
import { Actions, Effect } from "@ngrx/effects";
import { of } from "rxjs/observable/of";

import { Injectable } from "@angular/core";

//import * as RouterActions from './router.actions';
import * as _ from "lodash";

import { defer } from "rxjs/observable/defer";
import { ILogger } from "../../services/logger.common";

import { HttpHelperServiceCommon } from "../../services/http_helper.common";

import { Logger } from "../../services/logger";
import { QuestionFeatureState, getSelectedTagIds, ISelectedTagIds } from "./reducers";
import * as QuestionActions from "./actions";

import { IQuestion } from "../models/questions";
import { QuestionActionTypes } from "./actions";
import { stringify } from "../../common/utils/String";
import { RemoteDataService } from "../../services/remote_data.common";
import { ServiceCache } from "../../services/service_cache";
import { ServiceCacheKey } from "../../services/service_cache.common";
import { HttpErrorResponse } from "@angular/common/http";
//import {getSelectedTagIds} from "../../word/store/reducers";

@Injectable()
export class QuestionEffects {
    private log: ILogger;

    constructor(
        private remoteData: RemoteDataService,
        private httpService: HttpHelperServiceCommon,
        private serviceCache: ServiceCache,
        private actions$: Actions,
        private store: Store<QuestionFeatureState>,
        private logger: Logger
    ) {
        this.log = logger.getLogger(QuestionEffects.name);

        this.log.info("Loaded question effects");
    }

    @Effect()
    initEffect$: Observable<Action> = defer(() => {
        return of(true).pipe(
            mergeMap(t => {
                //Fetch cached tags
                return this.serviceCache.Load(ServiceCacheKey.QUESTION_TAGS_KEY).pipe(
                    catchError( (err) => {
                        this.log.debug("no cached tags");
                        let emptyTags : ISelectedTagIds = {
                            andList: [],
                            notList: []
                        } ;
                        return of(emptyTags);
                    })
                )
            }),
            mergeMap(tagIds => {
                this.log.debug("Fetching inital questions and loading tags ");

                return [new QuestionActions.LoadQuestions({
                    force_refresh: false
                }), new QuestionActions.SelectTags(tagIds) ];
            }),
            // We want to delay since we want other effects triggered off of getlessons success to be registered
            delay(1),
            catchError(err => {
                this.log.warning("Error", err);
                return of(new QuestionActions.ActionError(err));
            })
        );
    });

    @Effect()
    loadQuestions$: Observable<Action> = this.actions$
        .ofType<QuestionActions.LoadQuestions>(
            QuestionActionTypes.LOAD_QUESTIONS
        )
        .pipe(
            withLatestFrom(this.store.pipe(select(getSelectedTagIds))),
            mergeMap(([action, tagIds]) => {
                let obs: Observable<Array<IQuestion>>;
                if (_.size(tagIds) <= 0) {
                    obs = this.remoteData.getQuestions(
                        action.payload.force_refresh
                    );
                } else {
                    obs = this.httpService.getQuestionsFromInternet(tagIds);
                }
                return obs.pipe(
                    map(
                        questions =>
                            new QuestionActions.LoadQuestionsSuccess(questions)
                    ),
                    //Needed otherwise if there is an error, it would unsubscribe/complete the returned observable
                    catchError(err => {
                        this.log.warning("Http failure", err);
                        return of(
                            new QuestionActions.ActionError(stringify(err))
                        );
                    })
                );
            })
        );

    @Effect()
    filterQuestions$: Observable<Action> = this.actions$
        .ofType<QuestionActions.SelectTags>(QuestionActionTypes.SELECT_TAGS)
        .pipe(
            delay(100),
            map(
                action => {
                    this.serviceCache.Save(ServiceCacheKey.QUESTION_TAGS_KEY, action.payload);
                    return new QuestionActions.LoadQuestions({ force_refresh: false });
                }
            )
        );

    @Effect()
    newQuestion: Observable<Action> = this.actions$
        .ofType<QuestionActions.UpdateQuestion>(
            QuestionActionTypes.NEW_QUESTION
        )
        .pipe(
            mergeMap(action => {
                return this.httpService.createQuestion(action.payload).pipe(
                    map(newQuestion => {
                        this.serviceCache
                            .Clear(ServiceCacheKey.QUESTIONS_KEY)
                            .subscribe(() =>
                                this.log.debug(
                                    "cache cleared after new updated"
                                )
                            );

                        return new QuestionActions.NewQuestionSuccess(
                            newQuestion
                        );
                    }),
                    //Needed otherwise if there is an error, it would unsubscribe/complete the returned observable
                    catchError(err => {
                        this.log.warning("Update question, Http failure", err);
                        return of(
                            new QuestionActions.NewQuestionFailure(
                                stringify(err)
                            )
                        );
                    })
                );
            })
        );

    @Effect()
    updateQuestion$: Observable<Action> = this.actions$
        .ofType<QuestionActions.UpdateQuestion>(
            QuestionActionTypes.UPDATE_QUESTION
        )
        .pipe(
            mergeMap(action => {
                return this.httpService.updateQuestion(action.payload).pipe(
                    map(updatedQuestion => {
                        return new QuestionActions.UpdateQuestionSuccess(
                            updatedQuestion
                        );
                    }),
                    //Needed otherwise if there is an error, it would unsubscribe/complete the returned observable
                    catchError((err: HttpErrorResponse) => {
                        this.log.warning("Update question, Http failure", err);
                        return of(
                            new QuestionActions.UpdateQuestionFailure(
                                stringify(err)
                            )
                        );
                    })
                );
            })
        );

    @Effect()
    clearCacheOnUpdateQuestion$: Observable<Action> = this.actions$
        .ofType<QuestionActions.UpdateQuestion>(
            QuestionActionTypes.UPDATE_QUESTION_SUCCESS
        )
        .pipe(
            mergeMap(action => {
                this.serviceCache
                    .Clear(ServiceCacheKey.QUESTIONS_KEY)
                    .subscribe(
                        () =>
                            this.log.debug(
                                "cache cleared after question updated"
                            ),
                        err => this.log.error(err)
                    );

                return null;
            })
        );

    @Effect()
    deleteQuestion$: Observable<Action> = this.actions$
        .ofType<QuestionActions.DeleteQuestion>(
            QuestionActionTypes.DELETE_QUESTION
        )
        .pipe(
            mergeMap(action => {
                let questionToDelete = action.payload;

                if (
                    questionToDelete.question_en.length > 1 ||
                    questionToDelete.question_ru.length > 1
                ) {
                    return of<QuestionActions.ActionError>(
                        new QuestionActions.ActionError(
                            "Cannot delete non empty question"
                        )
                    );
                }

                return this.httpService.deleteQuestion(action.payload).pipe(
                    map(
                        status =>
                            new QuestionActions.DeleteQuestionSuccess(
                                action.payload
                            )
                    ),
                    //Needed otherwise if there is an error, it would unsubscribe/complete the returned observable
                    catchError(err => {
                        this.log.warning("Http failure", err);
                        return of(
                            new QuestionActions.ActionError(stringify(err))
                        );
                    })
                );
            })
        );
}
