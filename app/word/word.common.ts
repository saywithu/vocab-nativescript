// app
import { SharedModule } from "../shared";
import { RouterModule } from "../common";
import {
    WORD_LIST_ROUTE_PATH,
    WORD_LIST_TITLE,
    TAG_LIST_ROUTE_PATH,
    TAG_LIST_TITLE
} from "./word.routes";
import { WordListComponent } from "./components/word-list/word-list.component";
import { MenuItem } from "../menu/interfaces/MenuItem";
import { prefix_slash } from "../common/utils/String";


import { TagListComponent } from "./components/tag-list/tag-list.component";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { WORD_STATE_KEY, word_state_reducer } from "./store/reducers";
import { WordEffects } from "./store/effects";
import {WordListCommonComponent} from "./components/word-list/word-list.common.component";
import {TagListCommonComponent} from "./components/tag-list/tag-list.common.component";

export const WORD_LIST_MENU_ITEM: MenuItem = {
    title: WORD_LIST_TITLE,
    link: [prefix_slash(WORD_LIST_ROUTE_PATH)],
    icon: String.fromCharCode(0xf02d)
};

export const TAG_LIST_MENU_ITEM: MenuItem = {
    title: TAG_LIST_TITLE,
    link: [prefix_slash(TAG_LIST_ROUTE_PATH)],
    icon: String.fromCharCode(0xf02d)
};

export const SHARED_MODULES: any[] = [
    SharedModule,
    RouterModule.forChild([
        {
            path: WORD_LIST_ROUTE_PATH,
            component: WordListComponent
        },
        {
            path: TAG_LIST_ROUTE_PATH,
            component: TagListComponent
        }
    ])
];

export const COMMON_IMPORTS = [
    //This could also be a map
    StoreModule.forFeature(WORD_STATE_KEY, word_state_reducer),
    EffectsModule.forFeature([WordEffects])
];

export const COMPONENT_DECLARATIONS: any[] = [
    WordListComponent,
    WordListCommonComponent,
    TagListComponent,
    TagListCommonComponent
];

export const COMPONENT_EXPORTS: any[] = [...COMPONENT_DECLARATIONS];
