import { Component, OnInit, OnDestroy } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

import { map } from "rxjs/operators/map";
import { Store, select } from "@ngrx/store";

import * as AppActions from "../../../sentence/store/actions";
import * as RouterActions from "../../../store/router/router.actions";

// import * as _ from "lodash";

import {
    selectSelectedLessonIndex,
    selectLessonsList,
    selectSentencesList,
    State
} from "../../../sentence/store/reducers";
import { takeUntil } from "rxjs/operators/takeUntil";
import { RemoteDataService } from "../../../services/remote_data.common";

import { ILessonSelectedEventData } from "../../../shared/lesson-select/lesson-select.common.component";
import { LESSON_TITLE } from "../../lesson.routes";
import { Lesson } from "../../../sentence/models";
import { SENTENCE_QUIZ_ROUTE_PATH } from "../../../sentence/sentence.routes";

@Component({
    template: ""
})
export class LessonCommonComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject<any>;
    lessonsList: Observable<Array<Lesson>>;

    selectedLessonIndex: Observable<number>;
    private isLoaded: boolean = false;
    status: string = "...";

    handleLogin() {
        console.log("Starting handleLogin");
    }
    constructor(
        private store: Store<State>,
        private remoteData: RemoteDataService
    ) {
        console.log("LessonComponentCommon constructor");
    }

    handleLessonSelected(eventData: ILessonSelectedEventData) {
        console.log("Lesson selected", eventData);
        this.store.dispatch(new AppActions.SelectLesson(eventData));
    }

    handleGotoLesson(eventData: ILessonSelectedEventData) {
        console.log("handleGotoLesson");
        this.store.dispatch(
            new AppActions.SelectSentence({ sentence_index: 0 })
        );

        this.handleLessonSelected(eventData);

        //Once we get sentence data, move
        this.store
            .pipe(takeUntil(this.ngUnsubscribe), select(selectSentencesList))
            .subscribe(newIndex => {
                this.store.dispatch(
                    new RouterActions.Go({ path: ["/" + SENTENCE_QUIZ_ROUTE_PATH] })
                );
            });
    }

    ngOnInit(): void {
        console.log("ngOnInit lesson base");
        if (this.isLoaded) {
            console.log("Already loaded, returning...");
            return;
        }
        this.ngUnsubscribe = new Subject();

        this.status = "Fetching lessons...";
        this.lessonsList = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(selectLessonsList),
            map(data => {
                // this.status = "Loading lessons completed.";
                return data;
            })
        );
        this.selectedLessonIndex = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(selectSelectedLessonIndex)
        );
    }

    ngOnDestroy(): void {
        this.isLoaded = false;
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }


    get title(): string {
        return LESSON_TITLE;
    }
}
