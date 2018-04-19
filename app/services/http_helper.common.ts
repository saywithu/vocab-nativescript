import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Constants } from "./constants";
import { Observable } from "rxjs/Observable";
import { base64_encode } from "../common/utils/String";

import { map } from "rxjs/operators/map";
import { _throw } from "rxjs/observable/throw";
import * as _ from "lodash";
import { ILogger } from "./logger.common";
import { Logger } from "./logger";
import { ISentence, IPartialSentence } from "../sentence/models";
import { IAudioFile } from "../models";
import { IWord, ITag } from "../word/models/word";
import { IQuestion } from "../question/models/questions";
import { ISelectedTagIds } from "../question/store/reducers";

export function IsAudioFile(obj: any): obj is IAudioFile {
    return (
        obj.audio_path !== undefined &&
        obj.exercise_number !== undefined &&
        obj.id !== undefined
    );
}

export enum ResourceNames {
    SENTENCES = "sentences",
    WORDS = "words",
    QUESTIONS = "questions",
    TAGS = "tags",
    AUDIO_FILES = "audiofiles"
}

export type AnswerQuestionResponse = {
    new_user_rating: number;
    new_question_rating: number;
    question_id: number;
};

export type QuestionAnswer = {
    question_id: number;
    answer: any;
};

@Injectable()
export class HttpHelperServiceCommon {
    private static getHeaders() {
        let headers = { "Content-Type": "application/json" };
        if (_.size(Constants.USERNAME) > 0) {
            const text = Constants.USERNAME + ":" + Constants.PASSWORD;
            const base64 = base64_encode(text);
            headers["Authorization"] = "Basic " + base64;
        }
        return headers;
    }

    private log: ILogger;

    constructor(private http: HttpClient, logger: Logger) {
        this.log = logger.getLogger(HttpHelperServiceCommon.name);

        this.log.info("Build Http Helper service common");
    }

    private static createRequestHeader() {
        const headers = new HttpHeaders();
        headers.append("Content-Type", "application/json");

        return headers;
    }

    private MapArray<T>(json: any, is_paginated: boolean = true): Array<T> {
        //console.dir(json);
        const results = is_paginated ? json["results"] : json;

        if (!_.isArray(results)) {
            this.log.warning("Did not get an array", results);
            throw new Error("not array");
        }
        if (results.length > 0 && _.isNil(results[0].id)) {
            throw new Error("Invalid Data");
        }
        return results;
    }

    private GetArrayFromInternet<T>(
        url_suffix,
        params: { [param: string]: string },
        is_paginated: boolean = true
    ): Observable<Array<T>> {
        if (_.isNil(this.http)) {
            return _throw("Http is nil");
        }

        const headers = HttpHelperServiceCommon.createRequestHeader();

        const url = Constants.API_URL + url_suffix;
        this.log.debug(`Making AJAX request to ${url}`);
        return this.http
            .get(url, { headers, params })
            .pipe(
                map<any, Array<T>>(json => this.MapArray(json, is_paginated))
            );
    }

    answerQuestion(
        questionAnswer: QuestionAnswer
    ): Observable<AnswerQuestionResponse> {
        const url = Constants.SERVER_URL + "/answer";
        return this.http.request<AnswerQuestionResponse>("post", url, {
            body: questionAnswer,
            headers: HttpHelperServiceCommon.getHeaders()
        });
    }

    getTagsFromInternet(): Observable<ITag[]> {
        return this.GetArrayFromInternet("/tags/", { page_size: "1000" });
    }

    getWordsFromInternet(tag_ids: Array<number>): Observable<IWord[]> {
        let params: { [param: string]: string } = {
            page_size: "1000",
            ordering: "-created"
        };

        if (_.size(tag_ids) > 0) {
            params.tags = _.join(tag_ids, ",");
        }
        return this.GetArrayFromInternet("/words/", params);
    }

    getAudioFilesFromInternet(): Observable<IAudioFile[]> {
        return this.GetArrayFromInternet(
            "/" + ResourceNames.AUDIO_FILES + "/",
            {},
            false
        );
    }

    getSentencesFromInternet(audio_file_id: number): Observable<ISentence[]> {
        return this.GetArrayFromInternet("/" + ResourceNames.SENTENCES + "/", {
            audio_file_id: "" + audio_file_id
        });
    }

    getQuestionsFromInternet(
        tag_ids: ISelectedTagIds
    ): Observable<Array<IQuestion>> {
        let params: { [param: string]: string } = {
            page_size: "1000",
            ordering: "-created"
        };

        if (_.size(tag_ids.andList) > 0) {
            params.tags = _.join(tag_ids.andList, ",");
        }
        if (_.size(tag_ids.notList) > 0) {
            params.not_tags = _.join(tag_ids.notList, ",");
        }
        return this.GetArrayFromInternet(
            "/" + ResourceNames.QUESTIONS + "/",
            params
        );
    }

    updateSentence(
        sentence: ISentence,
        pSentenceFieldsToUpdate: IPartialSentence
    ): Observable<ISentence> {
        const url = `${Constants.API_URL}/${ResourceNames.SENTENCES}/${
            sentence.id
        }/`;

        let sentenceFieldsToUpdate = _.cloneDeep(pSentenceFieldsToUpdate);
        this.log.debug(
            "Updating sentence with url",
            url,
            sentenceFieldsToUpdate
        );

        _.each(
            [
                "word_audio_start_time",
                "word_audio_stop_time",
                "audio_start_time",
                "audio_stop_time"
            ],
            floatField => {
                let floatValue = sentenceFieldsToUpdate[floatField];
                try {
                    floatValue = parseFloat(floatValue);
                } catch (err) {
                    if (floatValue) {
                        this.log.debug(
                            "Caught while converting to float",
                            floatField,
                            floatValue,
                            err
                        );
                    }
                }

                if (_.isFinite(floatValue)) {
                    sentenceFieldsToUpdate[floatField] = floatValue;
                } else {
                    _.unset(sentenceFieldsToUpdate, floatField);
                }
            }
        );

        return this.http.request<ISentence>("patch", url, {
            body: sentenceFieldsToUpdate,
            headers: HttpHelperServiceCommon.getHeaders()
        });
    }

    updateWord(word: Partial<IWord>): Observable<IWord> {
        const url = `${Constants.API_URL}/${ResourceNames.WORDS}/${word.id}/`;

        return this.http.request<IWord>("patch", url, {
            body: word,
            headers: HttpHelperServiceCommon.getHeaders()
        });
    }

    updateQuestion(question: Partial<IQuestion>): Observable<IQuestion> {
        const url = `${Constants.API_URL}/${ResourceNames.QUESTIONS}/${
            question.id
        }/`;

        return this.http.request<IQuestion>("patch", url, {
            body: question,
            headers: HttpHelperServiceCommon.getHeaders()
        });
    }

    getQuestion(question_id: number): Observable<IQuestion> {
        const url = `${Constants.API_URL}/${
            ResourceNames.QUESTIONS
        }/${question_id}/`;

        return this.http.request<IQuestion>("get", url, {
            //            headers: HttpHelperServiceCommon.getHeaders()
        });
    }

    createQuestion(sentence: Partial<IQuestion>): Observable<IQuestion> {
        return this.createResource(ResourceNames.QUESTIONS, sentence);
    }

    createSentence(sentence: IPartialSentence): Observable<ISentence> {
        return this.createResource(ResourceNames.SENTENCES, sentence);
    }

    createTag(tag: Partial<ITag>): Observable<ITag> {
        return this.createResource(ResourceNames.TAGS, tag);
    }

    createWord(word: Partial<IWord>): Observable<IWord> {
        return this.createResource(ResourceNames.WORDS, word);
    }

    private createResource<T>(
        resourceName: ResourceNames,
        resource: Partial<T>
    ): Observable<T> {
        const url = `${Constants.API_URL}/${resourceName}/`;

        return this.http.request<T>("post", url, {
            body: resource,
            headers: HttpHelperServiceCommon.getHeaders()
        });
    }

    private deleteResource<T extends { id: number }>(
        resourceName: ResourceNames,
        resource: T
    ): Observable<T> {
        const url = `${Constants.API_URL}/${resourceName}/${resource.id}/`;

        return this.http
            .request<string>("delete", url, {
                headers: HttpHelperServiceCommon.getHeaders()
            })
            .pipe(map(() => resource));
    }

    deleteQuestion(sentence: IQuestion): Observable<IQuestion> {
        return this.deleteResource(ResourceNames.QUESTIONS, sentence);
    }
    deleteSentence(sentence: ISentence): Observable<ISentence> {
        return this.deleteResource(ResourceNames.SENTENCES, sentence);
    }
    deleteWord(word: IWord): Observable<IWord> {
        return this.deleteResource(ResourceNames.WORDS, word);
    }
    deleteTag(tag: ITag): Observable<ITag> {
        return this.deleteResource(ResourceNames.TAGS, tag);
    }
}
