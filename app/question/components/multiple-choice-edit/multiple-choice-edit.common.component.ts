import {Component, OnDestroy, OnInit} from "@angular/core";

import * as _ from "lodash";
import {Logger} from "../../../services/logger";
import {ILogger} from "../../../services/logger.common";
import {AllQuestionTypes, IMultipleChoiceQuestion, IQuestion, QuestionType} from "../../models/questions";
import {EventEmitter, Input, Output} from "@angular/core";

@Component({template: ''})
export class MultipleChoiceEditCommonComponent implements OnInit, OnDestroy {

    @Input() inputQuestion: IMultipleChoiceQuestion;
    @Output() save = new EventEmitter<IMultipleChoiceQuestion>();
    @Output() saveField = new EventEmitter<{
            prop_value: string,
            prop_name: keyof IQuestion,
            question: AllQuestionTypes
        }>();
    @Output() cancel = new EventEmitter();


    editQuestion: IMultipleChoiceQuestion;
    numberChoices: number;

    protected log: ILogger;

    constructor(
        protected logger: Logger
    ) {
        this.log = this.logger.getLogger(MultipleChoiceEditCommonComponent.name);
        this.log.debug("QuestionComponentCommon constructor");
    }

    ngOnInit(): void {

        this.editQuestion = _.cloneDeep(this.inputQuestion);


        this.editQuestion.resourcetype = QuestionType.MultipleChoiceQuestion.name;
        this.numberChoices = this.editQuestion.choices.length;
    }

    ngOnDestroy(): void {

    }

    private static resize(arr, newSize, defaultValue) {
        while(newSize > arr.length) {
            arr.push(defaultValue);
        }
        arr.length = newSize;
    }

    handleChoicesChanged(newChoiceText)
    {
        this.numberChoices = parseInt(newChoiceText);
        MultipleChoiceEditCommonComponent.resize(
            this.editQuestion.choices,
            this.numberChoices,
            ""
        )
    }

}
