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
import {
    transliterate,
    un_transliterate,
    LinkType
} from "../../../common/utils/String";
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

@Component({
    template: '',
})
export class WordListCommonComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject<any>;
    wordList$: Observable<IWord[]>;

    word$: Observable<IWord>;

    selectedLinkType: LinkType = LinkType.W_EN;

    tagList$: Observable<Array<ITag>>;
    selectedTagIds$: Observable<Array<number>>;

    appStatus: Observable<string>;

    private text_ru_tr: string;

    private isLoaded: boolean = false;
    protected localStatus: string = "...";

    protected log: ILogger;

    constructor(
        private store: Store<State>,
        private remoteData: RemoteDataService,
        protected logger: Logger
    ) {
        this.log = this.logger.getLogger(WordListCommonComponent.name);
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
            select(getAllWords),
            map( words => {
                return _.orderBy(words, ["id"], ['desc']);
            })
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

    handleFilterTagsSelected(selectedTagIds) {
        this.log.debug("Tags selected", selectedTagIds);
        this.store.dispatch(new WordActions.SelectTags(selectedTagIds));
    }

    handleNewWord(
        new_word_ru: string
    ) {
        this.store.dispatch(new WordActions.NewWord( {word_ru: new_word_ru}));
    }

    handleSaveWord(
        word_prop_value: string,
        word_prop: keyof IWord,
        word: IWord
    ) {
        this.log.debug("save word", event, word_prop, word);

        if (word_prop != "id") {
            this.store.dispatch(
                new WordActions.UpdateWord({
                    ...word,
                    [word_prop]: word_prop_value
                })
            );
        }
    }

    doUntransliterate(str: string) {
        return un_transliterate(str);
    }

    doTransliterate(str: string) {
        return transliterate(str);
    }

    handleDeleteWord(word: IWord) {
        this.store.dispatch(new WordActions.DeleteWord(word));
    }

    handleWordTagsSelected(selectedTagIds: Array<number>, word: IWord) {
        this.log.debug("tags selected", selectedTagIds, word);
        this.store.dispatch(
            new WordActions.UpdateWord({ ...word, tags: selectedTagIds })
        );
    }

    /*

  render() {
    let word_ru = this.props.word.word_ru;

    let parsed_example_ru = util.tokenize_sentence(this.props.word.example_ru || '');
    let edit_url = "/words/" + encodeURIComponent(this.props.word.word_ru) + "/";

    let show_example_fn = (str: string, idx: number): JSX.Element => {
      if (idx % 2 == 0) {

        let url: string = util.get_url(str, this.state.link_type);

        return ();
      }
      else {
        return (<div key = {idx}>{str}</div>);
      }


    };

    */
}
