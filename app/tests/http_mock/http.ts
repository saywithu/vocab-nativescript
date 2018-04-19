
import { Observable } from 'rxjs/Observable';

import { NSFileSystem } from "nativescript-angular/file-system/ns-file-system";


//Angular includes
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientTestingBackend } from './backend';
import { async, inject } from "@angular/core/testing";
import { ReflectiveInjector, Injectable, Injector } from "@angular/core";
import {
    HttpClient, HttpHeaders, HttpResponse,
    HttpInterceptor, HttpBackend, HttpHandler,
    HttpRequest, HttpEvent, HttpClientModule
} from "@angular/common/http";
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

import {_throw} from "rxjs/observable/throw";

@Injectable()
export class PassThruHttpInterceptingHandler implements HttpHandler {

    public constructor(private backend: HttpBackend) { }

    handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
        if (!this.backend) {
            return _throw("Backend is null");
        }
        return this.backend.handle(req);
    }
}
