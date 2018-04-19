import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";

import {
    createSelector,
    createFeatureSelector,
    ActionReducerMap
} from "@ngrx/store";
import * as _ from "lodash";
import * as AppActions from "./actions";

import * as fromRoot from "../../store";
import { QuestionActionTypes } from "./actions";
import {IQuestion} from "../models/questions";
import { WordFeatureState, getAllTags, getTagIds } from "../../word/store/reducers";

export const QUESTION_STATE_KEY = "question";
export const QUESTION_ENTITIES_KEY = "question_entities";

export interface QuestionFeatureState {
    [QUESTION_STATE_KEY]: QuestionState;
}

//The Root state + slice
export interface State extends fromRoot.State, QuestionFeatureState, WordFeatureState {}

//This is a slice of the root state
export const reducers: ActionReducerMap<QuestionFeatureState> = {
    [QUESTION_STATE_KEY]: question_state_reducer
};

export type Action = AppActions.All;

export interface QuestionState {
    selectedQuestionId: number | null;
    status: string;
    selectedTagIds: Array<number>,
    selectedNotTagIds: Array<number>,
    [QUESTION_ENTITIES_KEY]: EntityState<IQuestion>;

}

export const questionAdapter: EntityAdapter<IQuestion> = createEntityAdapter<IQuestion>({
    selectId: (question: IQuestion) => question.id,
    sortComparer: false
});

export const initialState: QuestionState = {
    selectedQuestionId: null,
    selectedTagIds: [],
    selectedNotTagIds: [],
    status: "Initial",

    [QUESTION_ENTITIES_KEY]: questionAdapter.getInitialState()
};

export function question_state_reducer(
    state = initialState,
    action: Action
): QuestionState {
    switch (action.type) {

        case QuestionActionTypes.LOAD_QUESTIONS_SUCCESS: {
            return {
                ...state,
                status: "Questions loaded",
                [QUESTION_ENTITIES_KEY]: questionAdapter.addMany(
                    action.payload,
                    questionAdapter.removeAll(state[QUESTION_ENTITIES_KEY])
                )
            };
        }

        case QuestionActionTypes.SELECT_QUESTION: {
            return {
                ...state,
                selectedQuestionId: action.payload
            };
        }

        case QuestionActionTypes.NEW_QUESTION_SUCCESS: {
            return {
                ...state,
                status: "New question added",
                [QUESTION_ENTITIES_KEY]: questionAdapter.addOne(
                    action.payload,
                    state[QUESTION_ENTITIES_KEY]
                )
            }
        }

        case QuestionActionTypes.UPDATE_QUESTION: {
            return {
                ...state,
                status: "Updating sentence..."
            };
        }
        case QuestionActionTypes.UPDATE_QUESTION_SUCCESS: {
            return {
                ...state,
                status: "Question updated",
                [QUESTION_ENTITIES_KEY]: questionAdapter.updateOne(
                    {id: action.payload.id, changes: action.payload},
                    state[QUESTION_ENTITIES_KEY]
                )
            }
        }

        case QuestionActionTypes.DELETE_QUESTION: {
            return {
                ...state,


                status: `Deleting question: ${action.payload.question_en} ${action.payload.question_ru} `
            };
        }

        case QuestionActionTypes.DELETE_QUESTION_SUCCESS: {
            return {
                ...state,
                status: `Question deleted: ${action.payload.id}`,
                [QUESTION_ENTITIES_KEY]: questionAdapter.removeOne(
                    action.payload.id,
                    state[QUESTION_ENTITIES_KEY]
                )
            };
        }

        case QuestionActionTypes.SELECT_TAGS: {
            return {
                ...state,
                selectedTagIds: _.map( action.payload.andList || state.selectedTagIds, (elem) => _.parseInt(elem as any)),
                selectedNotTagIds: _.map( action.payload.notList || state.selectedNotTagIds, (elem) => _.parseInt(elem as any)),
                status: `Tags selected: ${action.payload}`
            }
        }


        case QuestionActionTypes.ACTION_ERROR: {
            return {
                ...state,
                status: action.payload
            };
        }

        default: {
            return {
                ...state,
                status: "Unhandled action " + (action as any).type
            };
        }
    }
}

export const selectQuestionState = createFeatureSelector<QuestionState>(QUESTION_STATE_KEY);

export const selectQuestionEntities = createSelector(
    selectQuestionState,
    state => state[QUESTION_ENTITIES_KEY]
);


export const getSelectedId = (state: QuestionState) => state.selectedQuestionId;

export const getSelectedQuestionId = createSelector(selectQuestionState, getSelectedId);


export const {
    selectIds: getQuestionIds,
    selectEntities: getQuestionEntities,
    selectAll: getAllQuestions,
    selectTotal: getTotalQuestions
} = questionAdapter.getSelectors(selectQuestionEntities);


export const getSelectedQuestion = createSelector(
    getQuestionEntities,
    getSelectedQuestionId,
    (entities, selectedId) => {
        return selectedId && entities[selectedId];
    }
);

export const selectStatus = createSelector(selectQuestionState, state => {
    return state.status;
});

export interface  ISelectedTagIds {
    "andList": Array<number>
    "notList": Array<number>
}      ;

export const getSelectedTagIds = createSelector(
    selectQuestionState,
    getTagIds,
    (state, tagIds: Array<number>) => {

        return {
            "andList": _.intersection(state.selectedTagIds, tagIds),
            "notList": _.intersection(state.selectedNotTagIds, tagIds)
        };
    }
);


