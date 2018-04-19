import { Component } from '@angular/core';
import { QuestionListCommonComponent } from './question-list.common.component';

@Component({
    selector: 'vocab-question',
    moduleId: module.id,
    templateUrl: './question-list.component.html',
    styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent extends QuestionListCommonComponent  {

}
