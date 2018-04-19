import { Component, OnInit, OnDestroy } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Store, select } from "@ngrx/store";
import * as SentenceActions from "../../store/actions";
import * as _ from "lodash";

import { takeUntil } from "rxjs/operators/takeUntil";
import { RemoteDataService } from "../../../services/remote_data.common";

import {
    selectSentencesList,
    selectSelectedSentenceIndex,
    selectSelectedLessonIndex,
    selectLessonsList,
    selectSentence,
    selectStatus,
    State
} from "../../store/reducers";
import { ILessonSelectedEventData } from "../../../shared/lesson-select/lesson-select.common.component";
import { ISentenceSelectedEventData } from "../../../shared/sentence-select/sentence-select.common.component";
import { map } from "rxjs/operators/map";
import {LinkType, transliterate, un_transliterate} from "../../../common/utils/String";
import { Logger } from "../../../services/logger";
import { ILogger } from "../../../services/logger.common";
import { SENTENCE_TITLE } from "../../sentence.routes";
import { Lesson, ISentence } from "../../models";

@Component({
    template: '',
})
export class SentenceCommonComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject<any>;
    lessonsList: Observable<Lesson[]>;
    sentencesList: Observable<ISentence[]>;

    selectedLessonIndex: Observable<number>;
    selectedSentenceIndex: Observable<number>;

    appStatus: Observable<string>;

    sentence$: Observable<ISentence>;
    editSentence: ISentence;

    selectedLinkType: LinkType = LinkType.W_EN;

    private text_ru_tr: string;

    private isLoaded: boolean = false;
    protected localStatus: string = "...";

    protected log: ILogger;


    constructor(
        private store: Store<State>,
        private remoteData: RemoteDataService,
        protected logger: Logger
    ) {
        this.log = this.logger.getLogger(SentenceCommonComponent.name);
        this.log.debug("SentenceComponentCommon constructor");
    }

    ngOnInit(): void {
        this.log.debug("ngOnInit Sentence base");
        if (this.isLoaded) {
            this.log.debug("Already loaded, returning...");
            return;
        }
        this.ngUnsubscribe = new Subject();

        this.localStatus = "Fetching Sentences...";
        this.sentencesList = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(selectSentencesList)
        );
        this.selectedSentenceIndex = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(selectSelectedSentenceIndex)
        );
        this.selectedLessonIndex = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(selectSelectedLessonIndex)
        );
        this.lessonsList = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(selectLessonsList)
        );
        this.appStatus = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(selectStatus)
        );
        this.sentence$ = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(selectSentence),
            map(s => {
                this.editSentence = _.cloneDeep(s);
                if (this.editSentence) {
                    this.handleTextRuChanged(this.editSentence.text_ru);
                }
                return s;
            })
        );
    }

    ngOnDestroy(): void {
        this.isLoaded = false;
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    get title(): string {
        return SENTENCE_TITLE;
    }

    handleTextRuTrChanged(text_ru_tr) {
        this.editSentence.text_ru = transliterate(text_ru_tr);
    }

    handleTextRuChanged(text_ru) {
        this.text_ru_tr = un_transliterate(text_ru);
    }

    handleLessonSelected(eventData: ILessonSelectedEventData) {
        this.log.debug("Lesson selected");
        this.store.dispatch(new SentenceActions.SelectLesson(eventData));
    }

    handleSentenceSelected(eventData: ISentenceSelectedEventData) {
        this.log.debug(`Sentence selected: ${eventData.sentence_index}`);
        this.store.dispatch(new SentenceActions.SelectSentence(eventData));
    }

    handleNewSentence() {
        this.store.dispatch(new SentenceActions.NewSentence());
    }

    handleDeleteSentence() {
        this.store.dispatch(new SentenceActions.DeleteSentence());
    }

    handleSaveSentence(editSentence) {
        this.store.dispatch(new SentenceActions.UpdateSentence(editSentence));
    }
}
