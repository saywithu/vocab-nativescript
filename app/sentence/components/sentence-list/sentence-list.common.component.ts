import {Component, OnInit, OnDestroy} from "@angular/core";

//import { Observable, Subject } from 'rxjs/Rx';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {Store, select} from "@ngrx/store";
import * as SentenceActions from "../../store/actions";
import * as RouterActions from "../../../store/router/router.actions";

import {takeUntil} from "rxjs/operators/takeUntil";

import {
    selectLessonsList,
    selectSelectedLessonIndex,
    selectSentencesList,
    selectStatus,
    State
} from "../../store/reducers";
import {ILessonSelectedEventData} from "../../../shared/lesson-select/lesson-select.common.component";
import {Lesson, ISentence} from "../../models";
import {SENTENCE_QUIZ_ROUTE_PATH, SENTENCE_LIST_TITLE} from "../../sentence.routes";
import {LinkType} from "../../../common/utils/String";
import {RemoteDataService} from "../../../services/remote_data.common";
import {ILogger} from "../../../services/logger.common";
import {Logger} from "../../../services/logger";

@Component({
    template: ""
})
export class SentenceListCommonComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject<any> = new Subject();

    status: string = "...";

    lessonsList$: Observable<Array<Lesson>>;
    sentenceList$: Observable<Array<ISentence>>;
    selectedLessonIndex$: Observable<number>;
    appStatus$: Observable<string>;

    private log: ILogger;

    selectedLinkType: LinkType = LinkType.W_EN;

    private isLoaded: boolean = false;

    constructor(private store: Store<State>,
                private remoteData: RemoteDataService,
                private logger: Logger
    ) {
        this.log = logger.getLogger(SentenceListCommonComponent.name);

        this.log.debug("SentenceListComponentCommon constructor");
    }

    handleLessonSelected(eventData: ILessonSelectedEventData) {
        this.log.debug("Lesson selected", eventData);

        if (eventData.force_reload) {
            this.remoteData.getAudioFiles(true).subscribe(
                (lessons) => {
                    this.log.debug("Warming app up with getSentence call");
                    //Just to warm up the app
                    //this.remoteData.getSentences(0, lessons[0].id, true);

                    //Let store know we have new data
                    return new SentenceActions.GetLessonsSuccess(lessons);
                });
        }


        this.store.dispatch(new SentenceActions.SelectLesson(eventData));
    }

    handleGotoLesson(eventData: ILessonSelectedEventData) {
        this.store.dispatch(
            new SentenceActions.SelectSentence({sentence_index: 0})
        );

        console.log("handleGotoLesson");
        this.handleLessonSelected(eventData);

        //Once we get sentence data, move
        this.store
            .pipe(takeUntil(this.ngUnsubscribe), select(selectSentencesList))
            .subscribe(newIndex => {
                this.store.dispatch(
                    new RouterActions.Go({path: ["/" + SENTENCE_QUIZ_ROUTE_PATH]})
                );
            });
    }

    ngOnInit(): void {
        console.log("ngOnInit sentence-list base");

        if (this.isLoaded) {
            console.log("Already loaded");
        }

        this.isLoaded = true;
        this.status = "Fetching sentence-lists...";
        this.lessonsList$ = this.store.pipe(select(selectLessonsList));
        this.selectedLessonIndex$ = this.store.pipe(
            select(selectSelectedLessonIndex)
        );
        this.sentenceList$ = this.store.pipe(select(selectSentencesList));
        this.appStatus$ = this.store.pipe(select(selectStatus));
    }

    ngOnDestroy(): void {
        this.isLoaded = false;
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    get title(): string {
        return SENTENCE_LIST_TITLE;
    }
}
