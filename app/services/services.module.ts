import { NgModule, ModuleWithProviders } from '@angular/core';

import { ServiceCache } from "./service_cache";

import { RemoteDataService } from "./remote_data.common";
import { HttpHelperServiceCommon } from "./http_helper.common";
import { HttpClientModule } from '@angular/common/http';
import {SHARED_PROVIDERS} from "./services.module.common";
import { SpeechRecognition } from './speech-recognition/speech-recognition';

@NgModule({
    imports: [],
    declarations: [],
    exports: [
        HttpClientModule
    ],
    providers: [
        //HttpClientModule
    ]
})
export class ServicesModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ServicesModule,
            providers: [
                //HttpClientModule,
                SpeechRecognition,
                ...SHARED_PROVIDERS
            ]
        };
    }

};
