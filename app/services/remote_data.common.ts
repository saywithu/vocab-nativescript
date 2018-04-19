import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Observable";

import { Store } from "@ngrx/store";

import * as _ from "lodash";

import { map } from "rxjs/operators/map";
import { mergeMap } from "rxjs/operators/mergeMap";
import { catchError } from "rxjs/operators/catchError";

import { _throw } from "rxjs/observable/throw";
import { of } from "rxjs/observable/of";
import { HttpHelperServiceCommon, IsAudioFile } from "./http_helper.common";
import { ServiceCache } from "./service_cache";
import { ServiceCacheKey } from "./service_cache.common";
import { State } from "../store";
import { ISentence } from "../sentence/models";

import * as SentenceActions from "../sentence/store/actions";
import { ILoadSentencesSucessPayload } from "../sentence/store/actions";
import { IAudioFile } from "../models";
import { Logger } from "./logger";
import { ILogger } from "./logger.common";
import { IWord } from "../word/models/word";
import {IQuestion} from "../question/models/questions";

@Injectable()
export class RemoteDataService {
    private log: ILogger;

    constructor(
        private serviceCache: ServiceCache,
        private store: Store<State>,
        private httpService: HttpHelperServiceCommon,
        private logger: Logger
    ) {
        this.log = logger.getLogger(RemoteDataService.name);
    }

    saveSentences(jsonBlob, audio_file_id: number) {}

    updateConfidence(sentence: ISentence): Observable<ISentence> {
        return this.httpService
            .updateSentence(sentence, {
                known_confidence: sentence.known_confidence
            })
            .pipe(
                map(updatedSentence => {
                    this.store.dispatch(
                        new SentenceActions.UpdateSentenceSuccess(
                            updatedSentence
                        )
                    );
                    return updatedSentence;
                })
            );
    }

    updateAudio(sentence: ISentence): Observable<ISentence> {
        return this.httpService
            .updateSentence(sentence, {
                audio_start_time: sentence.audio_start_time,
                audio_stop_time: sentence.audio_stop_time
            })
            .pipe(
                map(updatedSentence => {
                    this.store.dispatch(
                        new SentenceActions.UpdateSentenceSuccess(
                            updatedSentence
                        )
                    );
                    return updatedSentence;
                })
            );
    }

    private compare_sentence(a: ISentence, b: ISentence) {
        if (a.audio_start_time < b.audio_start_time) {
            return -1;
        }
        if (a.audio_start_time > b.audio_start_time) {
            return 1;
        }
        return 0;
    }

    getSentences(
        lesson_index: number,
        audio_file_id: number,
        force_refresh: boolean
    ): Observable<ILoadSentencesSucessPayload> {
        let serviceCacheKey = ServiceCacheKey.GET_SENTENCES_CACHE_KEY(
            audio_file_id
        );

        this.log.info(`getSentences refresh: ${force_refresh} lesson: ${lesson_index}`);

        return this.getResources(serviceCacheKey, force_refresh, () =>
            this.httpService.getSentencesFromInternet(audio_file_id)
        ).pipe(
            map((sentences: Array<ISentence>) => {
                sentences.sort(this.compare_sentence);

                return {
                    sentences,
                    selectedLessonIndex: lesson_index
                };
            })
        );
    }



    getAudioFiles(
        force_refresh: boolean = false
    ): Observable<Array<IAudioFile>> {
        this.log.info("getAudioFiles");
        let serviceCacheKey = ServiceCacheKey.AUDIO_FILES_KEY;

        return this.getResources(serviceCacheKey, force_refresh, () =>
            //Fetch and cache
            this.httpService.getAudioFilesFromInternet(), (resource) =>
            IsAudioFile(resource)
        ).pipe(
            map(audioFiles => {


                let af = audioFiles;
                if (af.length > 50) {
                    af = audioFiles.slice(15, 52);
                }

                return af;
            })
        );
    }

    getWords(force_refresh:boolean = false) : Observable<Array<IWord>> {
        this.log.info("getWords");
        let serviceCacheKey = ServiceCacheKey.WORDS_KEY;

        return this.getResources<IWord>(serviceCacheKey, force_refresh, () =>
            //Fetch and cache
            this.httpService.getWordsFromInternet([])
        );
    }

    getQuestions(force_refresh:boolean = false) : Observable<Array<IQuestion>> {
        this.log.info("getWords");
        let serviceCacheKey = ServiceCacheKey.QUESTIONS_KEY;

        return this.getResources<IQuestion>(serviceCacheKey, force_refresh, () =>
            //Fetch and cache
            {
                return this.httpService.getQuestionsFromInternet({andList: [], notList: []});
            }
        );
    }

    private getResources<T>(
        serviceCacheKey: ServiceCacheKey<Array<T>>,
        force_refresh: boolean = false,
        http_fetch_fn: () => Observable<Array<T>>,
        check_resource_fn: (T) => boolean = null
    ): Observable<Array<T>> {
        this.log.info("Fetching resources from cache or internet");

        if (_.isNil(this.httpService)) {
            return _throw("Http service is null");
        }

        if (_.isNil(this.serviceCache)) {
            return _throw("Service cache is null");
        }

        const clearCacheObs = force_refresh
            ? this.serviceCache.Clear(serviceCacheKey)
            : of("No force refresh");

        return clearCacheObs.pipe(
            mergeMap(s => {
                if (force_refresh) {
                    this.log.debug("Not loading cache");
                    return of([]);
                } else {
                    this.log.debug("Loading cache", serviceCacheKey);
                    return this.serviceCache.Load(serviceCacheKey);
                }
            }),
            map(resourceList => {
                //Error handling
                if (!_.isArray(resourceList)) {
                    throw new Error("Resource List is not an array");
                }

                if (_.isEmpty(resourceList)) {
                    throw new Error("Resource list is empty");
                }

                if (_.isFunction(check_resource_fn) &&  !check_resource_fn(resourceList[0]) ) {
                    throw new Error("Json not valid");
                }


                return resourceList;
            }),
            catchError(err => {
                //If there is any problem, we get a fresh copy
                console.log("Error loading resource list cache: ", err);

                //Fetch and cache
                return http_fetch_fn().pipe(
                    map(fetchedResourceList => {
                        this.serviceCache.Save(
                            serviceCacheKey,
                            fetchedResourceList
                        );
                        return fetchedResourceList;
                    })
                );
            })
        );
    }
}
