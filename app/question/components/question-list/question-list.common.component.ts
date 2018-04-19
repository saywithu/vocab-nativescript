import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from "@angular/core";

import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {select, Store} from "@ngrx/store";
import * as QuestionActions from "../../store/actions";

import {getAllTags} from "../../../word/store/reducers";

import * as _ from "lodash";

import { takeUntil } from "rxjs/operators/takeUntil";

import { map } from "rxjs/operators/map";
import {
    LinkType,
} from "../../../common/utils/String";
import { Logger } from "../../../services/logger";
import { ILogger } from "../../../services/logger.common";
import { QUESTION_LIST_TITLE } from "../../question.routes";
import {
    AllQuestionTypes,
    IQuestion,
    QuestionType,
    generate_fill_in_blank
} from "../../models/questions";
import {
    getAllQuestions,
    selectStatus,
    State,
    getSelectedTagIds,
    ISelectedTagIds
} from "../../store/reducers";
import { ITag } from "../../../word/models/word";
import {
    HttpHelperServiceCommon,
    QuestionAnswer
} from "../../../services/http_helper.common";
import { mergeMap } from "rxjs/operators/mergeMap";

export interface QuestionAnswerWithQuestionObject extends QuestionAnswer {
    question: AllQuestionTypes;
}

@Component({ template: "" })
export class QuestionListCommonComponent
    implements OnInit, OnDestroy, OnChanges {
    private ngUnsubscribe: Subject<any>;
    questionList$: Observable<IQuestion[]>;

    private newQuestionType: QuestionType = QuestionType.FillInBlankQuestion;

    tagList$: Observable<Array<ITag>>;
    selectedTagIds$: Observable<ISelectedTagIds>;

    appStatus$: Observable<string>;


    private newQuestionTagIds: Array<number> = [];

    private isLoaded: boolean = false;

    protected log: ILogger;
    private is_edit_map: { [key: number]: boolean } = {};

    selectedLinkType: LinkType = LinkType.DICT;

    constructor(
        private store: Store<State>,
        private httpService: HttpHelperServiceCommon,
        protected logger: Logger
    ) {
        this.log = this.logger.getLogger(QuestionListCommonComponent.name);
        this.log.debug("QuestionComponentCommon constructor");
    }

    get questionTypeList() {
        return QuestionType.getAll();
    }

    handleReloadQuestionList() {
        this.store.dispatch(
            new QuestionActions.LoadQuestions({ force_refresh: true })
        );
    }

    ngOnChanges(changes: SimpleChanges) {
        this.log.debug("onchanges", changes);
    }

    ngOnInit(): void {
        this.log.debug("ngOnInit Question base");
        if (this.isLoaded) {
            this.log.debug("Already loaded, returning...");
            return;
        }
        this.ngUnsubscribe = new Subject();

        this.questionList$ = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(getAllQuestions),
            map(questions => {
                return _.orderBy(
                    questions,
                    [
                        q => {
                            if (_.size(q.question_ru + q.question_en) <= 1) {
                                //new questions should be in edit mode
                                this.is_edit_map[q.id] = true;
                                //put new questions on top
                                return "0000";
                            } else {
                                return q.last_answered || q.created;
                            }
                        }
                    ],
                    ["asc"]
                );
            })
        );
        this.appStatus$ = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(selectStatus)
        );
        this.tagList$ = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(getAllTags)
        );
        this.selectedTagIds$ = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(getSelectedTagIds),
            map( tagIds => {
                this.log.debug("Tags", tagIds);
                this.newQuestionTagIds = tagIds.andList;
                return tagIds;
            })
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
        this.store.dispatch(
            new QuestionActions.SelectTags({
                andList: selectedTagIds,
                notList: null
            })
        );
    }
    handleFilterNotTagsSelected(selectedTagIds) {
        this.log.debug("Tags selected", selectedTagIds);
        this.store.dispatch(
            new QuestionActions.SelectTags({
                notList: selectedTagIds,
                andList: null
            })
        );
    }

    handleCreateNewQuestion() {
        let question_type = this.newQuestionType;
        let new_question: Partial<AllQuestionTypes>;
        if (question_type === QuestionType.MultipleChoiceQuestion) {
            new_question = {
                question_ru: "н",
                question_en: "",
                choices: ["C 1", "C 2"],
                correct_answer_index: 0,
                resourcetype: question_type.name
            };
        } else if (question_type === QuestionType.FillInBlankQuestion) {
            new_question = {
                resourcetype: question_type.name,
                ...generate_fill_in_blank("{н}H")
            };
        }

        new_question.tags = this.newQuestionTagIds;

        this.store.dispatch(new QuestionActions.NewQuestion(new_question));

    }

    handleSaveQuestionField(field_data: {
        prop_value: string;
        prop_name: keyof IQuestion;
        question: AllQuestionTypes;
    }) {
        this.log.debug(
            "save question field",
            field_data.prop_name,
            field_data.prop_value,
            field_data.question
        );

        if (field_data.prop_name !== "id") {
            this.store.dispatch(
                new QuestionActions.UpdateQuestion({
                    ...field_data.question,
                    [field_data.prop_name]: field_data.prop_value
                })
            );
        }
    }

    handleSaveQuestion(question: AllQuestionTypes) {
        this.log.debug("save question", event, question);

        this.httpService
            .updateQuestion(question)
            .subscribe(updated_question => {
                this.store.dispatch(
                    new QuestionActions.UpdateQuestionSuccess(question)
                );

                this.is_edit_map[question.id] = false;
            });
    }

    isEdit(question: IQuestion) {
        return true === this.is_edit_map[question.id];
    }

    handleAnswerQuestion(questionAnswer: QuestionAnswerWithQuestionObject) {
        this.httpService
            .answerQuestion(questionAnswer)
            .pipe(
                mergeMap(resp => {
                    this.log.debug("User rating now", resp.new_user_rating);
                    return this.httpService.getQuestion(resp.question_id);
                })
            )
            .subscribe(question => {
                //let question = questionAnswer.question;
                //question.rating = resp.new_question_rating;

                //TODO dispatch user rating

                this.store.dispatch(
                    new QuestionActions.UpdateQuestionSuccess(question)
                );
            });
    }

    handleEditQuestion(question: IQuestion) {
        this.is_edit_map[question.id] = !this.is_edit_map[question.id];
    }

    handleDeleteQuestion(question: IQuestion) {
        this.store.dispatch(new QuestionActions.DeleteQuestion(question));
    }

    handleQuestionTagsSelected(
        selectedTagIds: Array<number>,
        question: AllQuestionTypes
    ) {
        this.log.debug("tags selected", selectedTagIds, question);
        this.store.dispatch(
            new QuestionActions.UpdateQuestion({
                ...question,
                tags: selectedTagIds
            })
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
