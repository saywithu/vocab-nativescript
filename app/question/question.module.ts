import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
// app
import {COMMON_IMPORTS, COMPONENT_DECLARATIONS, COMPONENT_EXPORTS, SHARED_MODULES} from "./question.common";

import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

//nativescript 123

@NgModule({
    imports: [
        RouterModule,
        FormsModule,
        CommonModule,
        ...COMMON_IMPORTS,

        ...SHARED_MODULES,
    ],
    declarations: [...COMPONENT_DECLARATIONS],
    exports: [...COMPONENT_EXPORTS]
})
export class QuestionModule {}
