import { NativeScriptCommonModule } from "nativescript-angular/common";

import { SharedModule } from "../shared/shared.module";

import { StoreModule } from "@ngrx/store";

import { NgModule, Optional, SkipSelf } from "@angular/core";
import { SentenceComponent } from "./components/sentence/sentence.component";
import {
    COMMON_IMPORTS,
    COMPONENT_DECLARATIONS,
    COMPONENT_EXPORTS
} from "./sentence.common";
import { SetConfidenceDialogComponent } from "./components/set-confidence-dialog/set-confidence-dialog";
// app

@NgModule({
    imports: [...COMMON_IMPORTS, NativeScriptCommonModule, ],
entryComponents: [SetConfidenceDialogComponent],
    declarations: [...COMPONENT_DECLARATIONS, SetConfidenceDialogComponent ],
    exports: [...COMPONENT_EXPORTS],
    schemas: []
})
export class SentenceModule {
    constructor(
        @Optional()
        @SkipSelf()
        parentModule: SentenceModule
    ) {
        if (parentModule) {
            throw new Error(
                "SentenceModule already loaded; Import in root module only."
            );
        }
    }
}
