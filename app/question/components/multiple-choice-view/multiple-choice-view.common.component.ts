import {Component, OnDestroy, OnInit} from "@angular/core";

import * as _ from "lodash";
import {Logger} from "../../../services/logger";
import {ILogger} from "../../../services/logger.common";
import {AllQuestionTypes, IMultipleChoiceQuestion, IQuestion, QuestionType} from "../../models/questions";
import {EventEmitter, Input, Output} from "@angular/core";

@Component({template: '',})
export class MultipleChoiceViewCommonComponent  {

    @Input() question: IMultipleChoiceQuestion;
    @Output() answer = new EventEmitter();



    protected log: ILogger;

    constructor(
        protected logger: Logger
    ) {
        this.log = this.logger.getLogger(MultipleChoiceViewCommonComponent.name);
        this.log.debug("QuestionComponentCommon constructor");
    }

   



}
