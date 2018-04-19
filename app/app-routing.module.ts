// angular
import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular';
// app
import { APP_ROUTES } from './app.routes';

@NgModule({
    imports: [
        NativeScriptRouterModule.forRoot(<any>APP_ROUTES),
    ],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }

