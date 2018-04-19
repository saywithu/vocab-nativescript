import {
    Component,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy
} from "@angular/core";

import { RemoteDataService } from "../../../services/remote_data.common";
import * as _ from "lodash";

import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { takeUntil } from "rxjs/operators/takeUntil";

import { Store, select } from "@ngrx/store";
import * as Actions from "../../store/actions";
import {
    selectSentencesList,
    selectSelectedSentenceIndex,
    selectSentence,
    State
} from "../../store/reducers";
import * as SentenceActions from "../../store/actions";

import { ISentenceSelectedEventData } from "../../../shared/sentence-select/sentence-select.common.component";
import { AudioService } from "../../../services/audio/audio";
import { ISentence } from "../../models";
import { SENTENCE_QUIZ_TITLE } from "../../sentence.routes";
import { Logger } from "../../../services/logger";
import { ILogger } from "../../../services/logger.common";
import {ILessonSelectedEventData} from "../../../shared/lesson-select/lesson-select.common.component";

@Component({
    template: "",
})
export class SentenceQuizCommonComponent implements OnInit, OnDestroy {
    protected ngUnsubscribe: Subject<any>;

    sentence$: Observable<ISentence>;
    sentencesList$: Observable<Array<ISentence>>;

    selectedSentenceIndex$: Observable<number>;

    editSentence: ISentence;

    protected isLoaded: boolean = false;

    @ViewChild("scratchTextField") scratchTextField: any;

    russianVisible: boolean = false;
    protected alwaysShowRussian: boolean = false;

    scratchText: string = ".";

    protected log: ILogger;

    constructor(
        protected audioFileService: AudioService,
        protected remoteData: RemoteDataService,
        protected store: Store<State>,
        protected viewContainerRef: ViewContainerRef,
        protected logger: Logger
    ) {
        this.log = this.logger.getLogger(SentenceQuizCommonComponent.name);
    }

    ngOnInit(): void {
        this.log.debug("SentenceQuiz BASE  ngOnInit");
        if (this.isLoaded) {
            this.log.warning("Sentence quiz BASE Already loaded");
            return;
        }

        this.isLoaded = true;
        this.ngUnsubscribe = new Subject();

        this.sentence$ = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(selectSentence)
        );

        //Must subscribe to actually get values
        this.sentence$.subscribe(s => {
            this.log.debug("Got new sentence", s);
            this.editSentence = _.cloneDeep(s);
        });

        this.sentencesList$ = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(selectSentencesList)
        );
        this.selectedSentenceIndex$ = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(selectSelectedSentenceIndex)
        );
    }

    ngOnDestroy(): void {
        console.log("Sentence quiz base ngOnDestroy");

        this.isLoaded = false;
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    get title(): string {
        return SENTENCE_QUIZ_TITLE;
    }

     handleLessonSelected(eventData: ILessonSelectedEventData) {

        this.store.dispatch(new SentenceActions.SelectLesson(eventData));
    }

    handleConfidenceChange($event) {
        //to be implemented
    }


    handleSentenceSelected(eventData: ISentenceSelectedEventData) {
        this.store.dispatch(new Actions.SelectSentence(eventData));

        this.russianVisible = this.alwaysShowRussian;
        this.handleClearText();
    }

    handleToggleRussian() {
        this.russianVisible = !this.russianVisible;
    }

    handleToggleRussianLongPress() {
        this.alwaysShowRussian = !this.alwaysShowRussian;
    }

    public handleClearText(): void {
        this.scratchText = "";
    }
}
