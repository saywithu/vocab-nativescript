
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { SharedModule } from "../shared/shared.module";

import { LessonComponent } from "./components/lesson/lesson.component";

import { StoreModule } from '@ngrx/store';

import { NgModule, Optional, SkipSelf } from '@angular/core';
// app

import { SHARED_MODULES } from './lesson.common';

@NgModule({
    imports: [
        ...SHARED_MODULES,
        NativeScriptCommonModule
    ],
    declarations: [
        LessonComponent        
    ],
    schemas: [
        
    ]
})
export class LessonModule {

    constructor( @Optional() @SkipSelf() parentModule: LessonModule) {
        if (parentModule) {
            throw new Error('LessonModule already loaded; Import in root module only.');
        }
    }
}