import { NativeScriptCommonModule } from "nativescript-angular/common";

import { SharedModule } from "../shared/shared.module";

import { StoreModule } from "@ngrx/store";

import { NgModule, Optional, SkipSelf } from "@angular/core";
import { WordComponent } from "./components/word/word.component";
import {
    SHARED_MODULES,
    COMPONENT_EXPORTS,
    COMPONENT_DECLARATIONS,
    COMMON_IMPORTS
} from "./word.common";
// app

@NgModule({
    imports: [...SHARED_MODULES, NativeScriptCommonModule, ...COMMON_IMPORTS],
    declarations: [...COMPONENT_DECLARATIONS],
    exports: [...COMPONENT_EXPORTS],
    schemas: []
})
export class WordModule {
    constructor(
        @Optional()
        @SkipSelf()
        parentModule: WordModule
    ) {
        if (parentModule) {
            throw new Error(
                "WordModule already loaded; Import in root module only."
            );
        }
    }
}
