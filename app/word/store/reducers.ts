import { createEntityAdapter, EntityAdapter, EntityState } from "@ngrx/entity";

import {
    createSelector,
    createFeatureSelector,
    ActionReducerMap
} from "@ngrx/store";
//import * as _ from "lodash";
import * as AppActions from "./actions";
import { IWord, ITag } from "../models/word";
import * as fromRoot from "../../store";
import { WordActionTypes } from "./actions";

export const WORD_STATE_KEY = "word";
export const WORD_ENTITIES_KEY = "word_entities";
export const TAG_ENTITIES_KEY = "tag_entities";

export interface WordFeatureState {
    [WORD_STATE_KEY]: WordState;
}

//The Root state + slice
export interface State extends fromRoot.State, WordFeatureState {}

//This is a slice of the root state
export const reducers: ActionReducerMap<WordFeatureState> = {
    [WORD_STATE_KEY]: word_state_reducer
};

export type Action = AppActions.All;

export interface WordState {
    selectedWordId: number | null;
    selectedTagIds: Array<number>;
    status: string;
    [WORD_ENTITIES_KEY]: EntityState<IWord>;
    [TAG_ENTITIES_KEY]: EntityState<ITag>;
}

export const tagAdapter: EntityAdapter<ITag> = createEntityAdapter<ITag>({
    selectId: (tag: ITag) => tag.id,
    sortComparer: false
});
export const wordAdapter: EntityAdapter<IWord> = createEntityAdapter<IWord>({
    selectId: (word: IWord) => word.id,
    sortComparer: false
});

export const initialState: WordState = {
    selectedWordId: null,
    selectedTagIds: [],
    status: "Initial",
    [TAG_ENTITIES_KEY]: tagAdapter.getInitialState(),
    [WORD_ENTITIES_KEY]: wordAdapter.getInitialState()
};

export function word_state_reducer(
    state = initialState,
    action: Action
): WordState {
    switch (action.type) {
        case WordActionTypes.LOAD_TAGS_SUCCESS: {
            return {
                ...state,
                status: "Tags loaded",
                [TAG_ENTITIES_KEY]: tagAdapter.addMany(
                    action.payload,
                    state[TAG_ENTITIES_KEY]
                )
            };
        }
        case WordActionTypes.NEW_TAG_SUCCESS: {
            return {
                ...state,
                status: "Tag added",
                [TAG_ENTITIES_KEY]: tagAdapter.addOne(
                    action.payload,
                    state[TAG_ENTITIES_KEY]
                )
            }
        }
        case WordActionTypes.UPDATE_TAG_SUCCESS: {
            return {
                ...state,
                status: "Tag updated",
                [TAG_ENTITIES_KEY]: tagAdapter.updateOne(
                    {id: action.payload.id, changes: action.payload},
                    state[TAG_ENTITIES_KEY]
                )
            }
        }
        case WordActionTypes.DELETE_TAG_SUCCESS: {
            return {
                ...state,
                status: "Tag Removed",
                [TAG_ENTITIES_KEY]: tagAdapter.removeOne(
                    action.payload.id,
                    state[TAG_ENTITIES_KEY]
                )
            }
        }
        case WordActionTypes.LOAD_WORDS_SUCCESS: {
            return {
                ...state,
                status: "Words loaded",
                [WORD_ENTITIES_KEY]: wordAdapter.addMany(
                    action.payload,
                    wordAdapter.removeAll(state[WORD_ENTITIES_KEY])
                )
            };
        }
        
        case WordActionTypes.SELECT_WORD: {
            return {
                ...state,
                selectedWordId: action.payload
            };
        }

        case WordActionTypes.NEW_WORD_SUCCESS: {
            return {
                ...state,
                status: "New word added",
                [WORD_ENTITIES_KEY]: wordAdapter.addOne(
                    action.payload,
                    state[WORD_ENTITIES_KEY]
                )
            }
        }

        case WordActionTypes.UPDATE_WORD: {
            return {
                ...state,
                status: "Updating sentence..."
            };
        }
        case WordActionTypes.UPDATE_WORD_SUCCESS: {
            return {
                ...state,
                status: "Word updated",
                [WORD_ENTITIES_KEY]: wordAdapter.updateOne(
                    {id: action.payload.id, changes: action.payload},
                    state[WORD_ENTITIES_KEY]
                )
            }
        }

        case WordActionTypes.DELETE_WORD: {
            return {
                ...state,
                status: `Deleting word: ${action.payload.word_en} / ${action.payload.word_ru}`
            };
        }

        case WordActionTypes.DELETE_WORD_SUCCESS: {
            return {
                ...state,
                status: `Word deleted: ${action.payload.id}`,
                [WORD_ENTITIES_KEY]: wordAdapter.removeOne(
                    action.payload.id,
                    state[WORD_ENTITIES_KEY]
                )
            };
        }

        case WordActionTypes.SELECT_TAGS: {
            return {
                ...state,
                selectedTagIds: action.payload,
                status: `Tags selected: ${action.payload}`
            }
        }

        case WordActionTypes.ACTION_ERROR: {
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

export const selectWordState = createFeatureSelector<WordState>(WORD_STATE_KEY);

export const selectWordEntities = createSelector(
    selectWordState,
    state => state[WORD_ENTITIES_KEY]
);
export const selectTagEntities = createSelector(
    selectWordState,
    state => state[TAG_ENTITIES_KEY]
);

export const getSelectedId = (state: WordState) => state.selectedWordId;

export const getSelectedWordId = createSelector(selectWordState, getSelectedId);

export const getSelectedTagIds = createSelector(
    selectWordState,
    state => state.selectedTagIds
);

export const {
    selectIds: getWordIds,
    selectEntities: getWordEntities,
    selectAll: getAllWords,
    selectTotal: getTotalWords
} = wordAdapter.getSelectors(selectWordEntities);

export const {
    selectIds: getTagIds,
    selectEntities: getTagEntities,
    selectAll: getAllTags,
    selectTotal: getTotalTags
} = tagAdapter.getSelectors(selectTagEntities);

export const getSelectedWord = createSelector(
    getWordEntities,
    getSelectedWordId,
    (entities, selectedId) => {
        return selectedId && entities[selectedId];
    }
);

export const selectStatus = createSelector(selectWordState, state => {
    return state.status;
});
