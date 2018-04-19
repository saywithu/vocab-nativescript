// app
import { SharedModule } from "../shared";
import { RouterModule } from "../common";
import {
    QUESTION_LIST_ROUTE_PATH,
    QUESTION_LIST_TITLE,

} from "./question.routes";
import { QuestionListComponent } from "./components/question-list/question-list.component";
import { MenuItem } from "../menu/interfaces/MenuItem";
import { prefix_slash } from "../common/utils/String";


import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { QUESTION_STATE_KEY, question_state_reducer } from "./store/reducers";
import { QuestionEffects } from "./store/effects";
import {MultipleChoiceEditComponent} from "./components/multiple-choice-edit/multiple-choice-edit.component";
import {FillInBlankEditComponent} from "./components/fill-in-blank-edit/fill-in-blank-edit.component";
import {FillInBlankViewComponent} from "./components/fill-in-blank-view/fill-in-blank-view.component";
import {MultipleChoiceViewComponent} from "./components/multiple-choice-view/multiple-choice-view.component";
import { QuestionListCommonComponent } from "./components/question-list/question-list.common.component";
import { FillInBlankEditCommonComponent } from "./components/fill-in-blank-edit/fill-in-blank-edit.common.component";
import { MultipleChoiceEditCommonComponent } from "./components/multiple-choice-edit/multiple-choice-edit.common.component";
import { FillInBlankViewCommonComponent } from "./components/fill-in-blank-view/fill-in-blank-view.common.component";
import { MultipleChoiceViewCommonComponent } from "./components/multiple-choice-view/multiple-choice-view.common.component";

export const QUESTION_LIST_MENU_ITEM: MenuItem = {
    title: QUESTION_LIST_TITLE,
    link: [prefix_slash(QUESTION_LIST_ROUTE_PATH)],
    icon: String.fromCharCode(0xf02d)
};


export const SHARED_MODULES: any[] = [
    SharedModule,
    RouterModule.forChild([
        {
            path: QUESTION_LIST_ROUTE_PATH,
            component: QuestionListComponent
        },

    ])
];

export const COMMON_IMPORTS = [
    //This could also be a map
    StoreModule.forFeature(QUESTION_STATE_KEY, question_state_reducer),
    EffectsModule.forFeature([QuestionEffects])
];

export const COMPONENT_DECLARATIONS: any[] = [
    QuestionListComponent,
    QuestionListCommonComponent,
    FillInBlankEditComponent,
    FillInBlankEditCommonComponent,
    MultipleChoiceEditComponent,
    MultipleChoiceEditCommonComponent,
    FillInBlankViewComponent,
    FillInBlankViewCommonComponent,
    MultipleChoiceViewComponent,
    MultipleChoiceViewCommonComponent
];

//export const COMPONENT_EXPORTS: any[] = [...COMPONENT_DECLARATIONS];
export const COMPONENT_EXPORTS: any[] = [];
