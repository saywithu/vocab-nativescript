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
import {
    getTagEntities,
    WordFeatureState,
    getSelectedTagIds
} from "./reducers";
import * as WordActions from "./actions";
import { IWord, ITag } from "../models/word";
import { WordActionTypes } from "./actions";
import { stringify } from "../../common/utils/String";
import { RemoteDataService } from "../../services/remote_data.common";
import { ServiceCache } from "../../services/service_cache";
import { ServiceCacheKey } from "../../services/service_cache.common";

@Injectable()
export class WordEffects {
    private log: ILogger;

    constructor(
        private remoteData: RemoteDataService,
        private httpService: HttpHelperServiceCommon,
        private serviceCache: ServiceCache,
        private actions$: Actions,
        private store: Store<WordFeatureState>,
        private logger: Logger
    ) {
        this.log = logger.getLogger(WordEffects.name);

        this.log.info("Loaded word effects");
    }

    @Effect()
    initEffect$: Observable<Action> = defer(() => {
        return of(true).pipe(
            mergeMap(t => {
                this.log.debug("Fetching inital tags ");

                return this.httpService.getTagsFromInternet();
            }),
            mergeMap((tags: Array<ITag>) => {
                //Let store know we have new data
                this.log.debug("Data fetched for inital tags & words");
                return [
                    new WordActions.LoadTagsSuccess(tags),
                    new WordActions.LoadWords({ force_refresh: false })
                ];
            }),
            // We want to delay since we want other effects triggered off of getlessons success to be registered
            delay(1),
            catchError(err => {
                this.log.warning("Error", err);
                return of(new WordActions.ActionError(err));
            })
        );
    });

    @Effect()
    loadWords$: Observable<Action> = this.actions$
        .ofType<WordActions.LoadWords>(WordActionTypes.LOAD_WORDS)
        .pipe(
            withLatestFrom(this.store.pipe(select(getSelectedTagIds))),
            mergeMap(([action, selectedTagIds]) => {
                let obs: Observable<Array<IWord>>;
                if (_.size(selectedTagIds) <= 0) {
                    obs = this.remoteData.getWords(
                        action.payload.force_refresh
                    );
                } else {
                    obs = this.httpService.getWordsFromInternet(selectedTagIds);
                }
                return obs.pipe(
                    map(words => new WordActions.LoadWordsSuccess(words)),
                    //Needed otherwise if there is an error, it would unsubscribe/complete the returned observable
                    catchError(err => {
                        this.log.warning("Http failure", err);
                        return of(new WordActions.ActionError(stringify(err)));
                    })
                );
            })
        );

    @Effect()
    filterWords$: Observable<Action> = this.actions$
        .ofType<WordActions.SelectTags>(WordActionTypes.SELECT_TAGS)
        .pipe(
            delay(100),
            map(action => new WordActions.LoadWords({ force_refresh: false }))
        );

    @Effect()
    newWord: Observable<Action> = this.actions$
        .ofType<WordActions.UpdateWord>(WordActionTypes.NEW_WORD)
        .pipe(
            mergeMap(action => {
                return this.httpService.createWord(action.payload).pipe(
                    map(newWord => {
                        this.serviceCache
                            .Clear(ServiceCacheKey.WORDS_KEY)
                            .subscribe(() =>
                                this.log.debug(
                                    "cache cleared after new updated"
                                )
                            );

                        return new WordActions.NewWordSuccess(newWord);
                    }),
                    //Needed otherwise if there is an error, it would unsubscribe/complete the returned observable
                    catchError(err => {
                        this.log.warning("Update word, Http failure", err);
                        return of(
                            new WordActions.NewWordFailure(stringify(err))
                        );
                    })
                );
            })
        );

    @Effect()
    updateWord$: Observable<Action> = this.actions$
        .ofType<WordActions.UpdateWord>(WordActionTypes.UPDATE_WORD)
        .pipe(
            mergeMap(action => {
                return this.httpService.updateWord(action.payload).pipe(
                    map(updatedWord => {
                        this.serviceCache
                            .Clear(ServiceCacheKey.WORDS_KEY)
                            .subscribe(() =>
                                this.log.debug(
                                    "cache cleared after word updated"
                                )
                            );

                        return new WordActions.UpdateWordSuccess(updatedWord);
                    }),
                    //Needed otherwise if there is an error, it would unsubscribe/complete the returned observable
                    catchError(err => {
                        this.log.warning("Update word, Http failure", err);
                        return of(
                            new WordActions.UpdateTagFailure(stringify(err))
                        );
                    })
                );
            })
        );

    @Effect()
    deleteWord$: Observable<Action> = this.actions$
        .ofType<WordActions.DeleteWord>(WordActionTypes.DELETE_WORD)
        .pipe(
            mergeMap(action => {
                let wordToDelete = action.payload;

                if (
                    _.size(wordToDelete.word_ru) > 1 ||
                    _.size(wordToDelete.word_en) > 1
                ) {
                    return of<WordActions.ActionError>(
                        new WordActions.ActionError(
                            "Cannot delete non empty word"
                        )
                    );
                }

                return this.httpService.deleteWord(action.payload).pipe(
                    map(
                        status =>
                            new WordActions.DeleteWordSuccess(action.payload)
                    ),
                    //Needed otherwise if there is an error, it would unsubscribe/complete the returned observable
                    catchError(err => {
                        this.log.warning("Http failure", err);
                        return of(new WordActions.ActionError(stringify(err)));
                    })
                );
            })
        );

    @Effect()
    newTag$: Observable<Action> = this.actions$
        .ofType<WordActions.NewTag>(WordActionTypes.NEW_TAG)
        .pipe(
            mergeMap(action => {
                return this.httpService.createTag(action.payload).pipe(
                    map(newTag => new WordActions.NewTagSuccess(newTag)),
                    //Needed otherwise if there is an error, it would unsubscribe/complete the returned observable
                    catchError(err => {
                        this.log.warning("Http failure", err);
                        return of(
                            new WordActions.NewTagFailure(stringify(err))
                        );
                    })
                );
            })
        );

    @Effect()
    deleteTag$: Observable<Action> = this.actions$
        .ofType<WordActions.DeleteTag>(WordActionTypes.DELETE_TAG)
        .pipe(
            mergeMap(action => {
                return this.httpService.deleteTag(action.payload).pipe(
                    mergeMap(newTag => [
                        new WordActions.DeleteTagSuccess(newTag),
                        new WordActions.LoadWords({ force_refresh: true })
                    ]),
                    //Needed otherwise if there is an error, it would unsubscribe/complete the returned observable
                    catchError(err => {
                        this.log.warning("Http failure", err);
                        return of(
                            new WordActions.DeleteTagFailure(stringify(err))
                        );
                    })
                );
            })
        );
}
