import {
    Component,
    OnDestroy,
    OnInit,
    SimpleChanges,
    SimpleChange,
    OnChanges
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
import { LinkType } from "../../../common/utils/String";
import { HttpHelperServiceCommon } from "../../../services/http_helper.common";
import { Store } from "@ngrx/store";
import { State } from "../../store/reducers";
import * as QuestionActions from "../../store/actions";

@Component({template: ""})
export class FillInBlankEditCommonComponent implements OnInit {
    @Input() inputQuestion: IFillInBlankQuestion;
    @Input() linkType: LinkType = LinkType.DICT;
    @Output() save = new EventEmitter<Partial<IFillInBlankQuestion>>();
    @Output()
    saveField = new EventEmitter<{
        prop_value: string;
        prop_name: keyof IQuestion;
        question: AllQuestionTypes;
    }>();
    @Output() doneEdit = new EventEmitter();

    editQuestion: Partial<IFillInBlankQuestion>;
    

    isSaving = false;

    protected log: ILogger;

    constructor(
        protected logger: Logger,
        private httpService: HttpHelperServiceCommon,
        private store: Store<State>
    ) {
        this.log = this.logger.getLogger(FillInBlankEditCommonComponent.name);
        this.log.debug("QuestionComponentCommon constructor");
    }


    ngOnInit(): void {
        if (this.inputQuestion == null) {
            this.editQuestion = {
                question_ru: "новый {вопрос}",
                question_en: ""
            };
        } else {
            this.editQuestion = _.cloneDeep(this.inputQuestion);
            //Convert answers/pos back into string
            let question_ru = this.editQuestion.question_ru;
            for (let i = this.editQuestion.answers.length - 1; i >= 0; --i) {
                let pos = this.editQuestion.positions[i];
                let ans = this.editQuestion.answers[i];
                question_ru =
                    question_ru.slice(0, pos) +
                    "{" +
                    ans +
                    "}" +
                    question_ru.slice(pos);
            }

            this.editQuestion.question_ru = question_ru;
        }

        this.editQuestion.resourcetype = QuestionType.FillInBlankQuestion.name;
    }

    handleSave() {
        if (this.isSaving) {
            return;
        }
        this.isSaving = true;
        let parsedQuestion = generate_fill_in_blank(this.editQuestion.question_ru);

        let question = {
            ...this.editQuestion,
            ...parsedQuestion
        };
        this.log.debug("save question", event, question);

        this.httpService
            .updateQuestion(question)
            .subscribe(updated_question => {
                this.store.dispatch(
                    new QuestionActions.UpdateQuestionSuccess(updated_question)
                );

                this.doneEdit.emit(true);
                this.isSaving = false;

            }, (err) => {
                this.log.error("Can't save", err);
                this.isSaving = false;
            });
    }
}
