import { NgModule, NO_ERRORS_SCHEMA, NgModuleFactoryLoader } from '@angular/core';
import { Http } from '@angular/http';
// nativescript
import { NSModuleFactoryLoader } from 'nativescript-angular/router';
import { NativeScriptHttpModule } from 'nativescript-angular/http';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
// vendor dependencies

// app
import { Config } from './common/index';
import { AppComponent } from './app.component';
import { SHARED_MODULES, SHARED_PROVIDERS, SHARED_DECLARATIONS } from './app.common';

Config.PLATFORM_TARGET = Config.PLATFORMS.MOBILE_NATIVE;

import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { Logger } from './services/logger';
import { MetaReducerLogger } from './services/reducer_logger';

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        NativeScriptHttpModule,
        NativeScriptHttpClientModule,

        ...SHARED_MODULES
    ],
    declarations: [
        AppComponent,

        ...SHARED_DECLARATIONS
    ],
    providers: [
        // Allows your {N} application to use lazy-loading
        //{ provide: NgModuleFactoryLoader, useClass: NSModuleFactoryLoader },
        Logger,
        MetaReducerLogger,
        ...SHARED_PROVIDERS
    ],
    schemas: [
        // NO_ERRORS_SCHEMA
    ],
    exports: [

    ]
})
export class AppModule { }
