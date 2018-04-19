import { createSelector, createFeatureSelector, ActionReducerMap } from "@ngrx/store";
import * as _ from "lodash";
import * as AppActions from "./actions";
import {SentenceActionTypes} from "./actions";

export type Action = AppActions.All;

import * as fromRoot from "../../store";

import { Lesson, ISentence } from "../models";
import { stringify } from "../../common/utils/String";

export interface SentenceState {
    status: string;
    selectedLessonIndex: null | number;
    lessons: Lesson[];
    sentences: ISentence[];
    selectedSentenceIndex: number | null;
}

export interface SentenceStateToPersist {
    selectedLessonIndex: null | number;
    selectedSentenceIndex: number | null;
}

export const SENTENCE_STATE_KEY = "sentence";


export interface SentenceFeatureState {
    [SENTENCE_STATE_KEY]: SentenceState;
}

//The Root state + slice
export interface State extends fromRoot.State, SentenceFeatureState {}

//This is a slice of the root state
export const reducers: ActionReducerMap<SentenceFeatureState> = {
    [SENTENCE_STATE_KEY]: sentence_state_reducer
};
// import { AudioFile, Sentence } from "../services/http_helper.common";

const initialState: SentenceState = {
    selectedLessonIndex: null,
    selectedSentenceIndex: null,
    status: "Initial",
    lessons: [],
    sentences: []
};

export interface ILessonsInfo {
    minLessonNumber: number;
    maxLessonNumber: number;
    lessons: Lesson[];
    selectedLessonNumber: number;
}

export function sentence_state_reducer(
    state = initialState,
    action: Action
): SentenceState {
    switch (action.type) {
        case SentenceActionTypes.UPDATE_SENTENCE: {
            return {
                ...state,
                status: "Updating sentence..."
            };
        }
        case SentenceActionTypes.ACTION_ERROR: {
            return {
                ...state,
                status: action.payload
            };
        }
        case SentenceActionTypes.UPDATE_SENTENCE_FAILURE: {
            return {
                ...state,
                status: "Failed to update sentence: " + stringify(action.payload)
            }
        }
        case SentenceActionTypes.GET_LESSONS_SUCCESS: {
            return {
                ...state,
                lessons: [...action.payload]
            };
        }

        case SentenceActionTypes.LOAD_SENTENCES_SUCCESS: {
            return {
                ...state,
                sentences: action.payload.sentences,
                status: "Sentences loaded"
            };
        }

        case SentenceActionTypes.UPDATE_SENTENCE_SUCCESS: {
            const s = state.sentences.slice();
            s[state.selectedSentenceIndex] = action.payload;
            return {
                ...state,
                status: "Sentence updated",
                sentences: s
            };
        }
        case SentenceActionTypes.SELECT_LESSON: {
            let lesson_index = action.payload.lesson_index;
            if (lesson_index >= state.lessons.length) {
                lesson_index = 0;
            }
            if (lesson_index < 0) {
                lesson_index = state.lessons.length - 1;
            }
            return {
                ...state,
                selectedLessonIndex: lesson_index,
                status: `Selecting lesson ${lesson_index}`
            };
        }
        case SentenceActionTypes.SELECT_SENTENCE: {
            let sentence_index = action.payload.sentence_index;
            if (sentence_index >= state.sentences.length) {
                sentence_index = 0;
            }
            if (sentence_index < 0) {
                sentence_index = state.sentences.length - 1;
            }
            return {
                ...state,
                selectedSentenceIndex: sentence_index
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

export const selectVocabState = createFeatureSelector<SentenceState>(
    SENTENCE_STATE_KEY
);
export const selectLessonsList = createSelector(
    selectVocabState,
    (state: SentenceState) => {
        return state.lessons;
    }
);
export const selectSentencesList = createSelector(
    selectVocabState,
    (state: SentenceState) => {
        return state.sentences;
    }
);
export const selectSelectedLessonIndex = createSelector(
    selectVocabState,
    state => {
        return state.selectedLessonIndex;
    }
);
export const selectSelectedSentenceIndex = createSelector(
    selectVocabState,
    state => {

        return _.min([state.sentences.length-1, state.selectedSentenceIndex]);
    }
);
export const selectStatus = createSelector(selectVocabState, state => {
    return state.status;
});
export const selectSentence = createSelector(selectVocabState, state => {
    if (
        _.size(state.sentences) <= 0 ||
        !_.isNumber(state.selectedSentenceIndex)
    ) {
        return null;
    }
    return state.sentences[state.selectedSentenceIndex];
});
export const selectStateToPersist = createSelector(
    selectVocabState,
    (state): SentenceStateToPersist => {
        return {
            selectedLessonIndex: state.selectedLessonIndex,
            selectedSentenceIndex: state.selectedSentenceIndex
        };
    }
);
