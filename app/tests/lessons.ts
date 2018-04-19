import { platformNativeScriptDynamic, NS_COMPILER_PROVIDERS } from "nativescript-angular/platform";
import * as appSettings from "application-settings";

const platform = platformNativeScriptDynamic({ bootInExistingPage: true });

//Angular includes
import {
    HttpClientTestingModule,
    HttpTestingController
} from "@angular/common/http/testing";
import { HttpClientTestingBackend } from "./http_mock/backend";
import { async, inject } from "@angular/core/testing";
import { ReflectiveInjector, Injectable, Injector } from "@angular/core";
import {
    HttpClient,
    HttpHeaders,
    HttpResponse,
    HttpInterceptor,
    HttpBackend,
    HttpHandler,
    HttpRequest,
    HttpEvent
} from "@angular/common/http";
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting
} from "@angular/platform-browser-dynamic/testing";

//Native script includes
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NSFileSystem } from "nativescript-angular/file-system/ns-file-system";
import { NativeScriptHttpModule } from "nativescript-angular/http";

import { NativeScriptModule } from "nativescript-angular/nativescript.module";

//Lib includes
import * as _ from "lodash";

//RxJS & NgRX
import { StoreModule, Store, combineReducers } from "@ngrx/store";

import { Observable } from "rxjs/Observable";
import { toPromise } from "rxjs/operator/toPromise";

import { mergeMap } from "rxjs/operators/mergeMap";
import { map } from "rxjs/operators/map";

//Application includes

//Services

import { HttpHelperServiceCommon } from "../services/http_helper.common";
import { RemoteDataService } from "../services/remote_data.common";
import { ServiceCache } from "../services/service_cache";
import { ServicesModule } from "../services/services.module";
import { ServiceCacheKey } from "../services/service_cache.common";

//App specific ngrx
import * as AppActions from "../sentence/store/actions";
//App other
import { LessonComponent } from "../lesson/components/lesson/lesson.component";
import { Constants } from "../services/constants";

//Test includes
import * as TestData from "./test_data";
import { PassThruHttpInterceptingHandler } from "./http_mock/http";
import { catchError } from "rxjs/operators";
import { SENTENCE_STATE_KEY,reducers  } from "../sentence/store/reducers";
import { Logger } from "../services/logger";

//Can't figure out how to build a store with the Static Injector so...
let rinjector = ReflectiveInjector.resolveAndCreate([
    ...(StoreModule.forRoot(reducers)
        .providers as any[])
]);
let store = rinjector.get(Store);

let injector = Injector.create({
    providers: [
        {
            provide: HttpBackend,
            useExisting: HttpClientTestingBackend
        },
        {
            provide: HttpHandler,
            useClass: PassThruHttpInterceptingHandler,
            //useFactory: (backend: HttpBackend) => new PassThruHttpInterceptingHandler(backend),
            deps: [HttpBackend]
        },
        {
            provide: HttpClient,
            useClass: HttpClient,
            deps: [HttpHandler]
        },
        {
            provide: HttpClientTestingBackend,
            useClass: HttpClientTestingBackend,
            deps: []
        },
        {
            provide: HttpTestingController,
            useExisting: HttpClientTestingBackend
        },
        {
            provide: Logger,
            useClass: Logger,
            deps: []
        },
        {
            provide: ServiceCache,
            useClass: ServiceCache,
            deps: [Logger]
        },
        {
            provide: RemoteDataService,
            useClass: RemoteDataService,
            //useFactory: remoteDataServiceFactory,
            deps: [ServiceCache, Store, HttpHelperServiceCommon, Logger]
        },
        {
            provide: HttpHelperServiceCommon,
            useClass: HttpHelperServiceCommon,
            deps: [HttpClient, Logger]
        },
        {
            provide: Store,
            //Resolve directly with an object, see ValueProvider https://angular.io/guide/dependency-injection
            useValue: store
        }
    ]
});
describe("Store and Services", () => {
    //let injector: TestBed;
    let httpMock: HttpTestingController;
    let httpClient: HttpClient;
    //let store: Store<RootState>;
    let remoteData: RemoteDataService;
    let serviceCache: ServiceCache;
    let httpBackend: HttpBackend;

    beforeEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

        httpClient = injector.get(HttpClient);

        remoteData = injector.get(RemoteDataService);
        serviceCache = injector.get(ServiceCache);

        //store = injector.get(Store) as any;
        httpMock = injector.get(HttpTestingController);

        httpBackend = injector.get(HttpBackend);
    });

    it("Services should all exist", () => {
        expect(1).toEqual(1);
        expect(httpClient).toBeDefined("Http Client should exist");
        expect(httpClient.get).toBeDefined("HttpClient get should exist");
        expect(_.isFunction(httpClient.get)).toBe(
            true,
            "Get should be a function"
        );
        expect(serviceCache).toBeDefined("Service Cache should exist");
        expect(_.isFunction(serviceCache.Load)).toBe(true);

        expect(httpMock === (httpBackend as any)).toBe(
            true,
            "Should be same instance"
        );
    });

    it("Http client module", done => {
        let url = "http://www.google.fr";
        httpClient.get(url).subscribe(body => {
            expect(body).toBe(3);
            done();
        });

        let req = httpMock.expectOne(url);

        req.flush(3);
    });

    it("Should load and save from cache", done => {
        expect(serviceCache).toBeDefined();

        let sk = ServiceCacheKey.GET_SENTENCES_CACHE_KEY(1);
        serviceCache
            .Clear(sk)
            .pipe(
                mergeMap(ok => {
                    expect(ok).toEqual("Cleared cache sentences1");
                    return serviceCache.Save(sk, TestData.testSentences1);
                }),
                mergeMap(ok => {
                    expect(ok).toEqual("Wrote sentence text, len = 512");
                    return serviceCache.Load(sk);
                }),
                mergeMap(ts => {
                    expect(ts).toEqual(TestData.testSentences1);
                    return serviceCache.Save(sk, TestData.testSentences2);
                }),
                mergeMap(ok => {
                    expect(ok).toEqual("Wrote sentence text, len = 2242");
                    return serviceCache.Load(sk);
                }),
                map(ts => {
                    expect(ts).toEqual(TestData.testSentences2);
                    return true;
                })
            )
            .subscribe(() => {
                done();
            });
    });

    xit("Load Lesson Component", done => {
        /*platform.bootstrapModule(ServicesModule).then(moduleRef => {
            remoteData = moduleRef.injector.get(RemoteDataService)
        });*/

        expect(remoteData).toBeDefined();
        expect(store).toBeDefined();

        store.dispatch(new AppActions.GetLessonsSuccess(TestData.lessonData1));
        let lesson = new LessonComponent(store, remoteData, null);
        lesson.ngOnInit();

        expect((lesson as any).lessons).toEqual(TestData.lessonData1);

        done();
    });

    it("Should load sentences", async done => {
        let lessonIndex = 0;
        let lessonId = 42;

        expect(httpMock).toBeDefined("http Mock should be defined");
        //expect(2).toEqual(3);
        await serviceCache
            .Clear(ServiceCacheKey.GET_SENTENCES_CACHE_KEY(lessonId))
            .toPromise();

        //Make a normal request

        remoteData
            .getSentences(0, lessonId, false)
            .pipe(
                mergeMap(
                    (sentenceData: AppActions.ILoadSentencesSucessPayload) => {
                        //normal request done
                        let sentences = sentenceData.sentences;
                        expect(sentences.length).toBe(1);
                        expect(_.isArray(sentences[0])).toEqual(
                            false,
                            "first sentenc is an array"
                        );
                        expect(sentences[0].id).toBe(175, "Sentence id");

                        //Refetch from cache
                        return remoteData.getSentences(0, lessonId, false);
                    }
                ),
                mergeMap(
                    (sentenceData: AppActions.ILoadSentencesSucessPayload) => {
                        let sentences = sentenceData.sentences;
                        expect(sentences.length).toBe(1);
                        expect(sentences[0].id).toBe(175);
                        //Force another http request
                        let obs = remoteData.getSentences(0, lessonId, true);

                        //At this point, the 2nd force reload is ready to go, so we flush it as well

                        return obs;
                    }
                ),
                catchError(err => {
                    console.log("Error caught", err);
                    fail(err);
                    done();
                    return [];
                })
            )
            .subscribe(
                async (
                    sentenceData: AppActions.ILoadSentencesSucessPayload
                ) => {
                    let sentences = sentenceData.sentences;
                    console.log(sentences);
                    expect(sentences.length).toBe(
                        4,
                        "Should have reloaded cache"
                    );
                    let cachedArray = await serviceCache
                        .Load(ServiceCacheKey.GET_SENTENCES_CACHE_KEY(lessonId))
                        .toPromise();
                    expect(cachedArray.length).toEqual(4);
                    for (let i = 0; i < 4; ++i) {
                        expect(cachedArray[i]).toEqual(
                            TestData.testSentences2[i]
                        );
                    }
                    httpMock.verify();
                    done();
                },
                err => {
                    fail(err);
                    done();
                }
            );

        setTimeout(() => {
            const req = httpMock.expectOne(
                `${Constants.API_URL}/sentences/?audio_file_id=42`
            );
            expect(req.request.method).toBe("GET");
            req.flush({
                count: 21,
                next: null,
                previous: null,
                results: TestData.testSentences1
            });

            setTimeout(() => {
                const req2 = httpMock.expectOne(
                    `${Constants.API_URL}/sentences/?audio_file_id=42`
                );
                expect(req2.request.method).toBe("GET");
                req2.flush({
                    count: 22,
                    next: null,
                    previous: null,
                    results: TestData.testSentences2
                });
            });
        }, 1);
    });
});
