import {Action} from "@ngrx/store";
import {ISentence, Lesson} from "../models";
import {ISentenceSelectedEventData} from "../../shared/sentence-select/sentence-select.common.component";
import {ILessonSelectedEventData} from "../../shared/lesson-select/lesson-select.common.component";


export enum SentenceActionTypes {
    UPDATE_SENTENCE = '[Sentence] UPDATE_SENTENCE',
    UPDATE_SENTENCE_SUCCESS = '[Sentence] UPDATE_SENTENCE_SUCCESS',
    UPDATE_SENTENCE_FAILURE = '[Sentence] UPDATE_SENTENCE_FAILURE',
    NEW_SENTENCE = '[Sentence] NEW_SENTENCE',
    NEW_SENTENCE_SUCCESS = '[Sentence] NEW_SENTENCE_SUCCESS',
    NEW_SENTENCE_FAILURE = '[Sentence] NEW_SENTENCE_FAILURE',
    DELETE_SENTENCE = '[Sentence] DELETE_SENTENCE',
    DELETE_SENTENCE_SUCCESS = '[Sentence] DELETE_SENTENCE_SUCCESS',
    DELETE_SENTENCE_FAILURE = '[Sentence] DELETE_SENTENCE_FAILURE',

    SELECT_LESSON = "SELECT_LESSON",

    GET_LESSONS_SUCCESS = "GET_LESSONS_SUCCESS",
    ACTION_ERROR = "ACTION_ERROR",

    SELECT_SENTENCE = "SELECT_SENTENCE",

    LOAD_SENTENCES_SUCCESS = "LOAD_SENTENCES_SUCCESS"

}

export class NewSentence implements Action {
    readonly type = SentenceActionTypes.NEW_SENTENCE;

    constructor() {
    }
}

export class NewSentenceSuccess implements Action {
    readonly type = SentenceActionTypes.NEW_SENTENCE_SUCCESS;

    constructor(public payload: ISentence) {
    }
}

export class NewSentenceFailure implements Action {
    readonly type = SentenceActionTypes.NEW_SENTENCE_FAILURE;

    constructor(public payload: string) {
    }
}

export class DeleteSentence implements Action {
    readonly type = SentenceActionTypes.DELETE_SENTENCE;

    constructor() {
    }
}

export class DeleteSentenceSuccess implements Action {
    readonly type = SentenceActionTypes.DELETE_SENTENCE_SUCCESS;

    constructor(public payload: ISentence) {
    }
}

export class DeleteSentenceFailure implements Action {
    readonly type = SentenceActionTypes.DELETE_SENTENCE_FAILURE;

    constructor(public payload: string) {
    }
}

export class UpdateSentence implements Action {
    readonly type = SentenceActionTypes.UPDATE_SENTENCE;

    constructor(public payload: ISentence) {
    }
}

export class UpdateSentenceSuccess implements Action {
    readonly type = SentenceActionTypes.UPDATE_SENTENCE_SUCCESS;

    constructor(public payload: ISentence) {
    }
}

export class UpdateSentenceFailure implements Action {
    readonly type = SentenceActionTypes.UPDATE_SENTENCE_FAILURE;

    constructor(public payload: string) {
    }
}

export type  SentenceActions =
    UpdateSentenceFailure
    | UpdateSentenceSuccess
    | UpdateSentence
    | NewSentenceFailure
    | NewSentenceSuccess
    | NewSentence
    | DeleteSentenceFailure
    | DeleteSentenceSuccess
    | DeleteSentence;


export interface ILoadSentencesSucessPayload {
    sentences: ISentence[];
    selectedLessonIndex: number;
}

export class LoadSentencesSuccess implements Action {
    readonly type = SentenceActionTypes.LOAD_SENTENCES_SUCCESS;

    constructor(public payload: ILoadSentencesSucessPayload) {
    }
}

export class SelectLesson implements Action {
    readonly type = SentenceActionTypes.SELECT_LESSON;

    constructor(public payload: ILessonSelectedEventData) {

    }
}

export class SelectSentence implements Action {
    readonly type = SentenceActionTypes.SELECT_SENTENCE;

    constructor(public payload: ISentenceSelectedEventData) {
    }
}

export class GetLessonsSuccess implements Action {
    readonly type = SentenceActionTypes.GET_LESSONS_SUCCESS;

    constructor(public payload: Lesson[]) {
    }
}

export class ActionError implements Action {
    readonly type = SentenceActionTypes.ACTION_ERROR;

    constructor(public payload: string) {
    }
}

export type All =
    | GetLessonsSuccess
    | LoadSentencesSuccess
    | ActionError
    | UpdateSentenceSuccess
    | SelectLesson
    | SelectSentence
    | GetLessonsSuccess
    | SentenceActions;
