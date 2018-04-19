import { Action } from "@ngrx/store";
import {AllQuestionTypes, IQuestion} from "../models/questions";
import { ISelectedTagIds } from "./reducers";

export enum QuestionActionTypes {
    //begin crud



    UPDATE_QUESTION = "[Question] UPDATE_QUESTION",
    UPDATE_QUESTION_SUCCESS = "[Question] UPDATE_QUESTION_SUCCESS",
    UPDATE_QUESTION_FAILURE = "[Question] UPDATE_QUESTION_FAILURE",
    NEW_QUESTION = "[Question] NEW_QUESTION",
    NEW_QUESTION_SUCCESS = "[Question] NEW_QUESTION_SUCCESS",
    NEW_QUESTION_FAILURE = "[Question] NEW_QUESTION_FAILURE",
    DELETE_QUESTION = "[Question] DELETE_QUESTION",
    DELETE_QUESTION_SUCCESS = "[Question] DELETE_QUESTION_SUCCESS",
    DELETE_QUESTION_FAILURE = "[Question] DELETE_QUESTION_FAILURE",

    SELECT_QUESTION = "SELECT_QUESTION",
    LOAD_QUESTIONS = "LOAD_QUESTIONS",
    LOAD_QUESTIONS_SUCCESS = "LOAD_QUESTIONS_SUCCESS",

    SELECT_TAGS = "[question] SELECT_TAGS",
    SELECT_TAGS_SUCCESS = "[question] SELECT_TAGS_SUCCESS",

    ACTION_ERROR = "[question] ACTION ERROR"
}

export class SelectTags implements Action {
    readonly type = QuestionActionTypes.SELECT_TAGS;

    constructor(public payload: ISelectedTagIds) {}
}

export class NewQuestion implements Action {
    readonly type = QuestionActionTypes.NEW_QUESTION;
    constructor(public payload: Partial<IQuestion>) {}
}
export class NewQuestionSuccess implements Action {
    readonly type = QuestionActionTypes.NEW_QUESTION_SUCCESS;
    constructor(public payload: IQuestion) {}
}
export class NewQuestionFailure implements Action {
    readonly type = QuestionActionTypes.NEW_QUESTION_FAILURE;
    constructor(public payload: string) {}
}
export class DeleteQuestion implements Action {
    readonly type = QuestionActionTypes.DELETE_QUESTION;
    constructor(public payload: IQuestion) {}
}
export class DeleteQuestionSuccess implements Action {
    readonly type = QuestionActionTypes.DELETE_QUESTION_SUCCESS;
    constructor(public payload: IQuestion) {}
}
export class DeleteQuestionFailure implements Action {
    readonly type = QuestionActionTypes.DELETE_QUESTION_FAILURE;
    constructor(public payload: string) {}
}
export class UpdateQuestion implements Action {
    readonly type = QuestionActionTypes.UPDATE_QUESTION;
    constructor(public payload: AllQuestionTypes) {}
}
export class UpdateQuestionSuccess implements Action {
    readonly type = QuestionActionTypes.UPDATE_QUESTION_SUCCESS;
    constructor(public payload: IQuestion) {}
}
export class UpdateQuestionFailure implements Action {
    readonly type = QuestionActionTypes.UPDATE_QUESTION_FAILURE;
    constructor(public payload: string) {}
}
export type QuestionActions =
    | UpdateQuestionFailure
    | UpdateQuestionSuccess
    | UpdateQuestion
    | NewQuestionFailure
    | NewQuestionSuccess
    | NewQuestion
    | DeleteQuestionFailure
    | DeleteQuestionSuccess
    | DeleteQuestion;


export class LoadQuestions implements Action {
    readonly type = QuestionActionTypes.LOAD_QUESTIONS;

    constructor(public payload: {force_refresh: boolean}) {}
}
export class LoadQuestionsSuccess implements Action {
    readonly type = QuestionActionTypes.LOAD_QUESTIONS_SUCCESS;

    constructor(public payload: Array<IQuestion>) {}
}

export class SelectQuestion implements Action {
    readonly type = QuestionActionTypes.SELECT_QUESTION;

    constructor(public payload: number) {}
}

export class ActionError implements Action {
    readonly type = QuestionActionTypes.ACTION_ERROR;
    constructor(public payload: string) {}
}

export type All =
    | LoadQuestionsSuccess
    | LoadQuestions

    | ActionError
    | SelectQuestion

    | QuestionActions
    | SelectTags
    ;
