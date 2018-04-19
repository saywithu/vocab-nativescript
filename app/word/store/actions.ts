import { Action } from "@ngrx/store";
import { IWord, ITag } from "../models/word";

export enum WordActionTypes {
    //begin crud

    UPDATE_TAG = "[Word] UPDATE_TAG",
    UPDATE_TAG_SUCCESS = "[Word] UPDATE_TAG_SUCCESS",
    UPDATE_TAG_FAILURE = "[Word] UPDATE_TAG_FAILURE",
    NEW_TAG = "[Word] NEW_TAG",
    NEW_TAG_SUCCESS = "[Word] NEW_TAG_SUCCESS",
    NEW_TAG_FAILURE = "[Word] NEW_TAG_FAILURE",
    DELETE_TAG = "[Word] DELETE_TAG",
    DELETE_TAG_SUCCESS = "[Word] DELETE_TAG_SUCCESS",
    DELETE_TAG_FAILURE = "[Word] DELETE_TAG_FAILURE",

    UPDATE_WORD = "[Word] UPDATE_WORD",
    UPDATE_WORD_SUCCESS = "[Word] UPDATE_WORD_SUCCESS",
    UPDATE_WORD_FAILURE = "[Word] UPDATE_WORD_FAILURE",
    NEW_WORD = "[Word] NEW_WORD",
    NEW_WORD_SUCCESS = "[Word] NEW_WORD_SUCCESS",
    NEW_WORD_FAILURE = "[Word] NEW_WORD_FAILURE",
    DELETE_WORD = "[Word] DELETE_WORD",
    DELETE_WORD_SUCCESS = "[Word] DELETE_WORD_SUCCESS",
    DELETE_WORD_FAILURE = "[Word] DELETE_WORD_FAILURE",

    SELECT_WORD = "SELECT_WORD",
    LOAD_WORDS = "LOAD_WORDS",
    LOAD_WORDS_SUCCESS = "LOAD_WORDS_SUCCESS",
    LOAD_TAGS_SUCCESS = "[word] LOAD_TAGS_SUCCESS",
    SELECT_TAGS = "[word] SELECT_TAGS",
    SELECT_TAGS_SUCCESS = "[word] SELECT_TAGS_SUCCESS",
    ACTION_ERROR = "[word] ACTION ERROR"
}

export class NewTag implements Action {
    readonly type = WordActionTypes.NEW_TAG;
    constructor(public payload: Partial<ITag>) {}
}
export class NewTagSuccess implements Action {
    readonly type = WordActionTypes.NEW_TAG_SUCCESS;
    constructor(public payload: ITag) {}
}
export class NewTagFailure implements Action {
    readonly type = WordActionTypes.NEW_TAG_FAILURE;
    constructor(public payload: string) {}
}
export class DeleteTag implements Action {
    readonly type = WordActionTypes.DELETE_TAG;
    constructor(public payload: ITag) {}
}
export class DeleteTagSuccess implements Action {
    readonly type = WordActionTypes.DELETE_TAG_SUCCESS;
    constructor(public payload: ITag) {}
}
export class DeleteTagFailure implements Action {
    readonly type = WordActionTypes.DELETE_TAG_FAILURE;
    constructor(public payload: string) {}
}
export class UpdateTag implements Action {
    readonly type = WordActionTypes.UPDATE_TAG;
    constructor(public payload: ITag) {}
}
export class UpdateTagSuccess implements Action {
    readonly type = WordActionTypes.UPDATE_TAG_SUCCESS;
    constructor(public payload: ITag) {}
}
export class UpdateTagFailure implements Action {
    readonly type = WordActionTypes.UPDATE_TAG_FAILURE;
    constructor(public payload: string) {}
}
export type TagActions =
    | UpdateTagFailure
    | UpdateTagSuccess
    | UpdateTag
    | NewTagFailure
    | NewTagSuccess
    | NewTag
    | DeleteTagFailure
    | DeleteTagSuccess
    | DeleteTag;

export class NewWord implements Action {
    readonly type = WordActionTypes.NEW_WORD;
    constructor(public payload: Partial<IWord>) {}
}
export class NewWordSuccess implements Action {
    readonly type = WordActionTypes.NEW_WORD_SUCCESS;
    constructor(public payload: IWord) {}
}
export class NewWordFailure implements Action {
    readonly type = WordActionTypes.NEW_WORD_FAILURE;
    constructor(public payload: string) {}
}
export class DeleteWord implements Action {
    readonly type = WordActionTypes.DELETE_WORD;
    constructor(public payload: IWord) {}
}
export class DeleteWordSuccess implements Action {
    readonly type = WordActionTypes.DELETE_WORD_SUCCESS;
    constructor(public payload: IWord) {}
}
export class DeleteWordFailure implements Action {
    readonly type = WordActionTypes.DELETE_WORD_FAILURE;
    constructor(public payload: string) {}
}
export class UpdateWord implements Action {
    readonly type = WordActionTypes.UPDATE_WORD;
    constructor(public payload: IWord) {}
}
export class UpdateWordSuccess implements Action {
    readonly type = WordActionTypes.UPDATE_WORD_SUCCESS;
    constructor(public payload: IWord) {}
}
export class UpdateWordFailure implements Action {
    readonly type = WordActionTypes.UPDATE_WORD_FAILURE;
    constructor(public payload: string) {}
}
export type WordActions =
    | UpdateWordFailure
    | UpdateWordSuccess
    | UpdateWord
    | NewWordFailure
    | NewWordSuccess
    | NewWord
    | DeleteWordFailure
    | DeleteWordSuccess
    | DeleteWord;

export class LoadTagsSuccess implements Action {
    readonly type = WordActionTypes.LOAD_TAGS_SUCCESS;

    constructor(public payload: Array<ITag>) {}
}
export class SelectTags implements Action {
    readonly type = WordActionTypes.SELECT_TAGS;

    constructor(public payload: Array<number>) {}
}

export class LoadWords implements Action {
    readonly type = WordActionTypes.LOAD_WORDS;

    constructor(public payload: {force_refresh: boolean}) {}
}
export class LoadWordsSuccess implements Action {
    readonly type = WordActionTypes.LOAD_WORDS_SUCCESS;

    constructor(public payload: Array<IWord>) {
        console.log("he");
        
    }
}

export class SelectWord implements Action {
    readonly type = WordActionTypes.SELECT_WORD;

    constructor(public payload: number) {}
}

export class ActionError implements Action {
    readonly type = WordActionTypes.ACTION_ERROR;
    constructor(public payload: string) {}
}

export type All =
    | LoadWordsSuccess
    | LoadWords
    | LoadTagsSuccess
    | ActionError
    | SelectWord
    | SelectTags
    | WordActions
    | TagActions;
