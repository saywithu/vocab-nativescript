import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';

import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';

import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptUISideDrawerModule } from "nativescript-pro-ui/sidedrawer/angular";

import { MyDrawerItemComponent } from "./my-drawer-item/my-drawer-item.component";
import { MyDrawerComponent } from "./my-drawer/my-drawer.component";

import {SideDrawerContainerComponent} from "./side-drawer-container/side-drawer-container";

import {SafePipe} from "../common/utils/SafePipe";
import { COMMON_DECLARATIONS } from './shared.module.common';
import { NumberPickerModule } from './number_picker';

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptUISideDrawerModule,
        NativeScriptFormsModule
    ],
    declarations: [
        MyDrawerComponent,
        MyDrawerItemComponent,
        SideDrawerContainerComponent,
        
        ...COMMON_DECLARATIONS
    ],
    exports: [
        MyDrawerComponent,
        NativeScriptUISideDrawerModule,
        NativeScriptModule,
        NativeScriptFormsModule,
        SideDrawerContainerComponent,
        NumberPickerModule,
        ...COMMON_DECLARATIONS
    ],
    schemas: [ 
        //NO_ERRORS_SCHEMA 
    ]
})
export class SharedModule { }
