import {
    Component,
    OnDestroy,
    OnChanges,
    OnInit,
    SimpleChanges,
    SimpleChange
} from "@angular/core";

import * as _ from "lodash";
import { Logger } from "../../../services/logger";
import { ILogger } from "../../../services/logger.common";
import {
    AllQuestionTypes,
    generate_fill_in_blank,
    IFillInBlankQuestion,
    IQuestion,
    QuestionType
} from "../../models/questions";
import { EventEmitter, Input, Output } from "@angular/core";
import { QuestionAnswerWithQuestionObject } from "../question-list/question-list.common.component";
import { HttpHelperServiceCommon } from "../../../services/http_helper.common";

import { Store } from "@ngrx/store";
import { State } from "../../store/reducers";
import * as QuestionActions from "../../store/actions";
import { mergeMap } from "rxjs/operators/mergeMap";

@Component({template: ""})
export class FillInBlankViewCommonComponent implements OnInit, OnChanges {
    @Input() question: IFillInBlankQuestion;

    protected log: ILogger;

    viewQuestionRu: string;
    answeredQuestionRu: string;

    answerList: Array<string>;

    isEnabled: boolean = false;
    isShowAnswer: boolean;

    constructor(
        protected logger: Logger,
        private httpService: HttpHelperServiceCommon,
        private store: Store<State>
    ) {
        this.log = this.logger.getLogger(FillInBlankViewCommonComponent.name);
        this.log.debug("QuestionComponentCommon constructor");
    }

    ngOnChanges(changes: SimpleChanges) {
        const name: SimpleChange = changes.name;
        if (_.isNil(name)) {
            this.log.debug("No changes");
        } else {
            this.log.debug(
                "cur / prev value: ",
                name.currentValue,
                name.previousValue
            );
        }
        this.isEnabled = true;
    }

    ngOnInit(): void {
        let question_ru = this.question.question_ru;
        this.answeredQuestionRu = this.question.question_ru;
        let reg = new RegExp(".", "g");
        this.answerList = new Array<string>();

        for (let i = this.question.answers.length - 1; i >= 0; --i) {
            let pos = this.question.positions[i];
            let ans = this.question.answers[i];

            this.answerList.push("");

            question_ru =
                question_ru.slice(0, pos) +
                "[" +
                ans.replace(reg, ".") +
                "]" +
                question_ru.slice(pos);
            this.answeredQuestionRu =
                question_ru.slice(0, pos) + ans + question_ru.slice(pos);
        }
        this.viewQuestionRu = question_ru;

        this.isEnabled = true;
        this.isShowAnswer = false;
    }

    handleShowAnswer() {
        this.isShowAnswer = !this.isShowAnswer;
    }

    handleAnswer() {
        if (!this.isEnabled) {
            this.log.info("Ignoring handle answer");
            return;
        }
        this.isEnabled = false;

        this.httpService
            .answerQuestion({
                question_id: this.question.id,
                answer: this.answerList
            }).subscribe(resp => {
                    this.log.debug("User rating now", resp.new_user_rating);
                    this.question.attempts = (this.question.attempts || 0) + 1;
                    this.question.rating = resp.new_question_rating;

                    this.handleShowAnswer();
                }
            );
    }
}
