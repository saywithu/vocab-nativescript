import { Component, OnInit, OnDestroy } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Store, select } from "@ngrx/store";
import * as WordActions from "../../store/actions";
import * as _ from "lodash";

import { takeUntil } from "rxjs/operators/takeUntil";
import { RemoteDataService } from "../../../services/remote_data.common";

import { ILessonSelectedEventData } from "../../../shared/lesson-select/lesson-select.common.component";

import { map } from "rxjs/operators/map";
import { transliterate, un_transliterate } from "../../../common/utils/String";
import { Logger } from "../../../services/logger";
import { ILogger } from "../../../services/logger.common";
import { WORD_LIST_TITLE } from "../../word.routes";
import { IWord, ITag } from "../../models/word";
import {
    State,
    getAllWords,
    selectStatus,
    getSelectedWord,
    getAllTags,
    getSelectedTagIds
} from "../../store/reducers";

@Component({})
export class WordCommonComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject<any>;
    private wordList$: Observable<IWord[]>;

    private word$: Observable<IWord>;

    private tagList$: Observable<Array<ITag>>;
    private selectedTagIds$: Observable<Array<number>>;

    private appStatus: Observable<string>;

    private text_ru_tr: string;

    private isLoaded: boolean = false;
    protected localStatus: string = "...";

    protected log: ILogger;

    private russianAlphabet = [
        "А а",
        "Б б",
        "В в",
        "Г г",
        "Д д",
        "Е е",
        "Ё ё",
        "Ж ж",
        "З з",
        "И и",
        "Й й",
        "К к",
        "Л л",
        "М м",
        "Н н",
        "О о",
        "П п",
        "Р р",
        "С с",
        "Т т",
        "У у",
        "Ф ф",
        "Х х",
        "Ц ц",
        "Ч ч",
        "Ш ш",
        "Щ щ",
        "Ъ ъ",
        "Ы ы",
        "Ь ь",
        "Э э",
        "Ю ю",
        "Я я"
    ];

    // tslint:disable-next-line:no-unused-variable
    private trAlphabet = _.map(this.russianAlphabet, ch =>
        un_transliterate(ch)
    );

    constructor(
        private store: Store<State>,
        private remoteData: RemoteDataService,
        protected logger: Logger
    ) {
        this.log = this.logger.getLogger(WordCommonComponent.name);
        this.log.debug("WordComponentCommon constructor");
    }

    ngOnInit(): void {
        this.log.debug("ngOnInit Word base");
        if (this.isLoaded) {
            this.log.debug("Already loaded, returning...");
            return;
        }
        this.ngUnsubscribe = new Subject();

        this.localStatus = "Fetching Words...";
        this.wordList$ = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(getAllWords)
        );
        this.appStatus = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(selectStatus)
        );
        this.word$ = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(getSelectedWord)
        );
        this.tagList$ = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(getAllTags)
        );
        this.selectedTagIds$ = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(getSelectedTagIds)
        );
    }

    ngOnDestroy(): void {
        this.isLoaded = false;
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    get title(): string {
        return WORD_LIST_TITLE;
    }

    handleTextRuChanged(text_ru) {
        this.text_ru_tr = un_transliterate(text_ru);
    }

    handleTagsSelected(selectedTagIds) {
        this.log.debug("Tags selected", selectedTagIds);
        this.store.dispatch(new WordActions.SelectTags(selectedTagIds));
    }
}
