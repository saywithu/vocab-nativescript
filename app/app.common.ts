import { AppRoutingModule } from "./app-routing.module";

import { HomeModule } from "./home/home.module";
import { MenuModule } from "./menu/menu.module";
import { LessonModule } from "./lesson/lesson.module";
import { AboutModule } from "./about/about.module";

import { RouterEffects } from "./store/router/router.effects";
import {
    StoreModule,
} from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";


import { ServicesModule } from "./services/services.module";


import { SentenceModule } from "./sentence/sentence.module";
import { reducers, metaReducers } from "./store";
import { WordModule } from "./word/word.module";
import {QuestionModule} from "./question/question.module";

export const SHARED_MODULES: any[] = [
    AppRoutingModule,
    WordModule,
    MenuModule,
    LessonModule,
    AboutModule,
    QuestionModule,
    SentenceModule,
    /**
     * StoreModule.forRoot is imported once in the root module, accepting a reducer
     * function or object map of reducer functions. If passed an object of
     * reducers, combineReducers will be run creating your application
     * meta-reducer. This returns all providers for an @ngrx/store
     * based application.
     */
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([RouterEffects]),
    ServicesModule.forRoot()
];

export const SHARED_PROVIDERS: any[] = [];

export const SHARED_DECLARATIONS: any[] = [
    //SafePipe
];

export * from "./app-routing.module";
