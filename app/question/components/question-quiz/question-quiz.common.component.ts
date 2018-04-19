import {Component, OnDestroy, OnInit} from "@angular/core";

import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {select, Store} from "@ngrx/store";
import * as QuestionActions from "../../store/actions";
import * as WordActions from "../../../word/store/actions";

import {getAllTags, getSelectedTagIds} from "../../../word/store/reducers";

import * as _ from "lodash";

import {takeUntil} from "rxjs/operators/takeUntil";
import {RemoteDataService} from "../../../services/remote_data.common";

import {map} from "rxjs/operators/map";
import {LinkType, transliterate, un_transliterate} from "../../../common/utils/String";
import {Logger} from "../../../services/logger";
import {ILogger} from "../../../services/logger.common";
import {QUESTION_LIST_TITLE} from "../../question.routes";
import {AllQuestionTypes, IQuestion, QuestionType} from "../../models/questions";
import {getAllQuestions, getSelectedQuestion, selectStatus, State,} from "../../store/reducers";
import {ITag} from "../../../word/models/word";

@Component({})
export class QuestionQuizCommonComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject<any>;
    private questionList$: Observable<IQuestion[]>;

    private question$: Observable<IQuestion>;



    private newQuestionType : QuestionType;

    private tagList$: Observable<Array<ITag>>;
    private selectedTagIds$: Observable<Array<number>>;

    private appStatus: Observable<string>;

    private isLoaded: boolean = false;
    protected localStatus: string = "...";

    protected log: ILogger;

    constructor(
        private store: Store<State>,
        protected logger: Logger
    ) {
        this.log = this.logger.getLogger(QuestionQuizCommonComponent.name);
        this.log.debug("QuestionComponentCommon constructor");
    }



    ngOnInit(): void {
        this.log.debug("ngOnInit Question base");
        if (this.isLoaded) {
            this.log.debug("Already loaded, returning...");
            return;
        }
        this.ngUnsubscribe = new Subject();

        this.localStatus = "Fetching Questions...";
        this.questionList$ = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(getAllQuestions),
            map( questions => {
                return _.orderBy(questions, ["id"], ['desc']);
            })
        );
        this.appStatus = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(selectStatus)
        );
        this.question$ = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(getSelectedQuestion)
        );

    }

    ngOnDestroy(): void {
        this.isLoaded = false;
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    get title(): string {
        return QUESTION_LIST_TITLE;
    }



    handleFilterTagsSelected(selectedTagIds) {
        this.log.debug("Tags selected", selectedTagIds);
        this.store.dispatch(new WordActions.SelectTags(selectedTagIds));
    }

    handleNewQuestion(
        new_question: AllQuestionTypes
    ) {
        this.store.dispatch(new QuestionActions.NewQuestion(new_question));
    }

    handleSaveQuestion(
        question_prop_value: string,
        question_prop: keyof IQuestion,
        question: AllQuestionTypes
    ) {
        this.log.debug("save question", event, question_prop, question);

        if (question_prop != "id") {
            this.store.dispatch(
                new QuestionActions.UpdateQuestion({
                    ...question,
                    [question_prop]: question_prop_value
                })
            );
        }
    }

    handleDeleteQuestion(question: IQuestion) {
        this.store.dispatch(new QuestionActions.DeleteQuestion(question));
    }

    handleQuestionTagsSelected(selectedTagIds: Array<number>, question: AllQuestionTypes) {
        this.log.debug("tags selected", selectedTagIds, question);
        this.store.dispatch(
            new QuestionActions.UpdateQuestion({ ...question, tags: selectedTagIds })
        );
    }

    /*

  render() {
    let question_ru = this.props.question.question_ru;

    let parsed_example_ru = util.tokenize_sentence(this.props.question.example_ru || '');
    let edit_url = "/questions/" + encodeURIComponent(this.props.question.question_ru) + "/";

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
