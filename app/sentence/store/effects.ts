import { mergeMap } from "rxjs/operators/mergeMap";
import { map } from "rxjs/operators/map";
import { delay } from "rxjs/operators/delay";
import { empty } from "rxjs/observable/empty";
import { take } from "rxjs/operators/take";
import { withLatestFrom } from "rxjs/operators/withLatestFrom";
import { catchError } from "rxjs/operators/catchError";

import { Observable } from "rxjs/Observable";
import { Action, Store, select } from "@ngrx/store";
import { Actions, Effect } from "@ngrx/effects";
import { of } from "rxjs/observable/of";

import { Injectable } from "@angular/core";

//import * as RouterActions from './router.actions';
import * as SentenceActions from "./actions";
import {SentenceActionTypes} from  "./actions";
import * as _ from "lodash";

import { defer } from "rxjs/observable/defer";
import {
    selectStateToPersist,
    selectVocabState,
    State,
    SentenceStateToPersist
} from "./reducers";
import { ILogger } from "../../services/logger.common";
import { ServiceCacheKey } from "../../services/service_cache.common";
import { RemoteDataService } from "../../services/remote_data.common";
import { HttpHelperServiceCommon } from "../../services/http_helper.common";
import { ServiceCache } from "../../services/service_cache";
import { stringify } from "../../common/utils/String";
import { Logger } from "../../services/logger";
import { IPartialSentence } from "../models";

@Injectable()
export class Effects {
    private log: ILogger;

    //When we select a lesson, fetch the sentences and sent off the success action with the fetched data
    @Effect()
    specialEffect$ = this.actions$
        .ofType<SentenceActions.SelectLesson>(SentenceActionTypes.SELECT_LESSON)
        .pipe(
            withLatestFrom(this.store),
            //Type for array not needed, but meh
            mergeMap(
                ([action, storeState]: [
                    SentenceActions.SelectLesson,
                    State
                ]) => {
                    //let lesson_index = action.payload.lesson_index;
                    //Index may have been wrapped around in the reducer
                    const lessonIndex = storeState.sentence.selectedLessonIndex;
                    this.log.debug("Getting sentences...");

                    return this.remoteData
                        .getSentences(
                            lessonIndex,
                            storeState.sentence.lessons[lessonIndex].id,
                            action.payload.force_reload
                        )
                        .pipe(
                            map(sentenceSuccessData => {
                                return new SentenceActions.LoadSentencesSuccess(
                                    sentenceSuccessData
                                );
                            }),
                            //Catch errors here to avoid completing the effects observable
                            catchError(err => {
                                return of(new SentenceActions.ActionError(err));
                            })
                        );
                }
            )
        );

    // Initial action, load lessons
    @Effect()
    initEffect$: Observable<Action> = defer(() => {
        return of(true).pipe(
            mergeMap(t => {
                return this.remoteData.getAudioFiles();
            }),
            map(lessons => {
                this.log.debug("Warming app up with getSentence call");
                //Just to warm up the app
                //this.remoteData.getSentences(0, lessons[0].id, true);

                //Let store know we have new data
                return new SentenceActions.GetLessonsSuccess(lessons);
            }),
            // We want to delay since we want other effects triggered off of getlessons success to be registered
            delay(1),
            catchError(err => {
                return of(new SentenceActions.ActionError(err));
            })
        );
    });

    // Load perisisted storage
    @Effect()
    loadPeristedStoreState$: Observable<Action> = this.actions$
        .ofType<SentenceActions.GetLessonsSuccess>(
            SentenceActionTypes.GET_LESSONS_SUCCESS
        )
        .pipe(
            mergeMap(t => {
                return this.cache.Load(
                    ServiceCacheKey.PERSISTENT_STORE_STATE_KEY
                );
            }),
            catchError((err): Observable<SentenceStateToPersist> => {
                // If the cache fails, then return something to continue
                return of({
                    selectedLessonIndex: null,
                    selectedSentenceIndex: null
                });
            }),
            withLatestFrom(this.store),
            map(([savedState, storeState]) => {
                this.log.debug("Loaded state", savedState);

                // Select a lesson or default to last
                let lessonIndex = savedState.selectedLessonIndex;

                if (!_.isNumber(lessonIndex)) {
                    lessonIndex = storeState.sentence.lessons.length - 1;
                }
                return new SentenceActions.SelectLesson({
                    lesson_index: lessonIndex,
                    force_reload: false
                });
            }),
            catchError(err => {
                return of(new SentenceActions.ActionError(err));
            })
        );

    @Effect()
    loadPeristedStoreStateSentences$: Observable<Action> = this.actions$
        .ofType<SentenceActions.LoadSentencesSuccess>(
            SentenceActionTypes.LOAD_SENTENCES_SUCCESS
        )
        .pipe(
            mergeMap(t => {
                return this.cache.Load(
                    ServiceCacheKey.PERSISTENT_STORE_STATE_KEY
                );
            }),
            catchError((err): Observable<SentenceStateToPersist> => {
                // If the cache fails, then return something to continue
                return of({
                    selectedLessonIndex: null,
                    selectedSentenceIndex: null
                });
            }),
            //Only want to load the cache once
            take(1),
            withLatestFrom(this.store),
            map(([savedState, storeState]) => {
                // Select a lesson or default to first
                let sentenceIndex = savedState.selectedSentenceIndex;

                if (!_.isNumber(sentenceIndex)) {
                    sentenceIndex = 0;
                }
                if (sentenceIndex >= storeState.sentence.sentences.length) {
                    sentenceIndex = storeState.sentence.sentences.length - 1;
                }
                return new SentenceActions.SelectSentence({
                    sentence_index: sentenceIndex
                });
            }),
            catchError(err => {
                return of(new SentenceActions.ActionError(err));
            })
        );

    // save selections to cache
    @Effect()
    saveSelections$: Observable<Action> = this.actions$
        .ofType<SentenceActions.SelectLesson | SentenceActions.SelectSentence>(
            SentenceActionTypes.SELECT_LESSON,
            SentenceActionTypes.SELECT_SENTENCE
        )
        .pipe(
            mergeMap(t => {
                return this.cache.Load(
                    ServiceCacheKey.PERSISTENT_STORE_STATE_KEY
                );
            }),
            catchError((err): Observable<SentenceStateToPersist> => {
                // If the cache fails, then return something to continue
                return of({
                    selectedLessonIndex: null,
                    selectedSentenceIndex: null
                });
            }),
            withLatestFrom(this.store.pipe(select(selectStateToPersist))),
            mergeMap(([lastSaved, stateToPerist]) => {
                if (_.isNumber(stateToPerist.selectedLessonIndex)) {
                    lastSaved.selectedLessonIndex =
                        stateToPerist.selectedLessonIndex;
                }
                if (_.isNumber(stateToPerist.selectedSentenceIndex)) {
                    lastSaved.selectedSentenceIndex =
                        stateToPerist.selectedSentenceIndex;
                }
                this.log.debug("Saving selections to cache", lastSaved);
                return this.cache.Save(
                    ServiceCacheKey.PERSISTENT_STORE_STATE_KEY,
                    lastSaved
                );
            }),
            mergeMap(ok => {
                return empty();
            })
        );

    @Effect()
    newSentence$: Observable<Action> = this.actions$
        .ofType<SentenceActions.NewSentence>(SentenceActionTypes.NEW_SENTENCE)
        .pipe(
            withLatestFrom(this.store.pipe(select(selectVocabState))),
            mergeMap(([, vocabState]) => {
                let newStartTime = 0;

                _.each(vocabState.sentences, sentence => {
                    newStartTime = _.max([
                        newStartTime,
                        sentence.audio_start_time,
                        sentence.audio_stop_time
                    ]);
                });

                newStartTime += 0.25;
                const newSentence: IPartialSentence = {
                    text_fr: "f",
                    text_ru: "r",
                    audio_file_id:
                        vocabState.lessons[vocabState.selectedLessonIndex].id,
                    audio_start_time: newStartTime,
                    audio_stop_time: newStartTime + 3
                };

                return this.httpService.createSentence(newSentence).pipe(
                    mergeMap(ok => {
                        this.log.debug(
                            `new sentence created, fetching sentences for lesson index #${
                                vocabState.selectedLessonIndex
                            }`
                        );
                        return this.remoteData.getSentences(
                            vocabState.selectedLessonIndex,
                            vocabState.lessons[vocabState.selectedLessonIndex]
                                .id,
                            true
                        );
                    }),
                    mergeMap(loadedSentenceData => {
                        this.log.debug(
                            `new sentence, new data loaded with ${
                                loadedSentenceData.sentences.length
                            } sentences`
                        );
                        return [
                            new SentenceActions.LoadSentencesSuccess(
                                loadedSentenceData
                            ),
                            new SentenceActions.SelectSentence({
                                sentence_index:
                                    loadedSentenceData.sentences.length - 1
                            })
                        ];
                    })
                );
            }),
            catchError(err => {
                return of(new SentenceActions.ActionError(err));
            })
        );

    @Effect()
    deleteSentence$: Observable<Action> = this.actions$
        .ofType<SentenceActions.NewSentence>(SentenceActionTypes.DELETE_SENTENCE)
        .pipe(
            withLatestFrom(this.store.pipe(select(selectVocabState))),
            mergeMap<any, Action>(([, vocabState]) => {
                const currentSentence =
                    vocabState.sentences[vocabState.selectedSentenceIndex];

                if (
                    currentSentence.text_fr.length > 1 ||
                    currentSentence.text_ru.length > 1
                ) {
                    return of<SentenceActions.ActionError>(
                        new SentenceActions.ActionError(
                            "Cannot delete non empty sentence"
                        )
                    );
                }

                return this.httpService.deleteSentence(currentSentence).pipe(
                    mergeMap(ok => {
                        return this.remoteData.getSentences(
                            vocabState.selectedLessonIndex,
                            vocabState.lessons[vocabState.selectedLessonIndex]
                                .id,
                            true
                        );
                    }),
                    mergeMap(loadedSentenceData => {
                        return [
                            new SentenceActions.LoadSentencesSuccess(
                                loadedSentenceData
                            ),
                            new SentenceActions.SelectSentence({
                                sentence_index:
                                    vocabState.selectedSentenceIndex - 1
                            })
                        ];
                    })
                );
            }),
            catchError(err => {
                return of(new SentenceActions.ActionError(err));
            })
        );

    @Effect()
    updateSentence$: Observable<Action> = this.actions$
        .ofType<SentenceActions.UpdateSentence>(SentenceActionTypes.UPDATE_SENTENCE)
        .pipe(
            withLatestFrom(this.store.pipe(select(selectVocabState))),
            mergeMap(([updateAction, vocabState]) => {
                this.log.debug(
                    "Updating sentence with index",
                    vocabState.selectedSentenceIndex
                );
                const currentSentence =
                    vocabState.sentences[vocabState.selectedSentenceIndex];

                return this.httpService
                    .updateSentence(currentSentence, updateAction.payload)
                    .pipe(
                        mergeMap(ok => {
                            return this.remoteData.getSentences(
                                vocabState.selectedLessonIndex,
                                vocabState.lessons[
                                    vocabState.selectedLessonIndex
                                ].id,
                                true
                            );
                        }),
                        map(
                            (
                                loadedSentenceData
                            ): SentenceActions.LoadSentencesSuccess => {
                                return new SentenceActions.LoadSentencesSuccess(
                                    loadedSentenceData
                                );
                            }
                        ),
                        //Needed otherwise if there is an error, it would unsubscribe/complete the returned observable
                        catchError(err => {
                            this.log.warning("Http failure", err);
                            return of(
                                new SentenceActions.ActionError(stringify(err))
                            );
                        })
                    );
            }),
            catchError(err => {
                this.log.warning("Unknown error while updating sentence", err);
                return of(new SentenceActions.ActionError(stringify(err)));
            })
        );

    constructor(
        private remoteData: RemoteDataService,
        private httpService: HttpHelperServiceCommon,
        private cache: ServiceCache,
        private actions$: Actions,
        private store: Store<State>,
        private logger: Logger
    ) {
        this.log = logger.getLogger(Effects.name);
    }
}
