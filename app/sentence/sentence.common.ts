// app
import { SharedModule } from "../shared";
import { RouterModule } from "../common";
import {
    SENTENCE_ROUTE_PATH,
    SENTENCE_TITLE,
    SENTENCE_QUIZ_TITLE,
    SENTENCE_LIST_TITLE,
    SENTENCE_LIST_ROUTE_PATH,
    SENTENCE_QUIZ_ROUTE_PATH
} from "./sentence.routes";
import { SentenceComponent } from "./components/sentence/sentence.component";
import { MenuItem } from "../menu/interfaces/MenuItem";
import { prefix_slash } from "../common/utils/String";
import { buildRoutes } from "../common/utils/AngularHelpers";
import { SentenceListComponent } from "./components/sentence-list/sentence-list.component";
import { SentenceQuizComponent } from "./components/sentence-quiz/sentence-quiz.component";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { SENTENCE_STATE_KEY, sentence_state_reducer } from "./store/reducers";
import { Effects } from "./store/effects";
import {SentenceCommonComponent} from "./components/sentence/sentence.common.component";
import {SentenceListCommonComponent} from "./components/sentence-list/sentence-list.common.component";
import {SentenceQuizCommonComponent} from "./components/sentence-quiz/sentence-quiz.common.component";

export const SENTENCE_MENU_ITEM: MenuItem = {
    title: SENTENCE_TITLE,
    link: [prefix_slash(SENTENCE_ROUTE_PATH)],
    icon: String.fromCharCode(0xf02d)
};

export const SENTENCE_QUIZ_MENU_ITEM: MenuItem = {
    title: SENTENCE_QUIZ_TITLE,
    link: [prefix_slash(SENTENCE_QUIZ_ROUTE_PATH)],
    icon: String.fromCharCode(0xf02d)
};

export const SENTENCE_LIST_MENU_ITEM: MenuItem = {
    title: SENTENCE_LIST_TITLE,
    link: [prefix_slash(SENTENCE_LIST_ROUTE_PATH)],
    icon: String.fromCharCode(0xf02d)
};

export const COMMON_IMPORTS: any[] = [
    SharedModule,
    StoreModule.forFeature(SENTENCE_STATE_KEY, sentence_state_reducer),

    EffectsModule.forFeature([Effects]),
    RouterModule.forChild([
        {
            path: SENTENCE_ROUTE_PATH,
            component: SentenceComponent
        },
        {
            path: SENTENCE_QUIZ_ROUTE_PATH,
            component: SentenceQuizComponent
        },
        {
            path: SENTENCE_LIST_ROUTE_PATH,
            component: SentenceListComponent
        }
    ])
];

export const COMPONENT_DECLARATIONS: any[] = [
    SentenceComponent,
    SentenceCommonComponent,
    SentenceListComponent,
    SentenceListCommonComponent,
    SentenceQuizComponent,
    SentenceQuizCommonComponent
];

export const COMPONENT_EXPORTS: any[] = [...COMPONENT_DECLARATIONS];
