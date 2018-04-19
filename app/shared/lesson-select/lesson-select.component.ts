import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from "@angular/core";

import { LessonSelectCommonComponent } from "./lesson-select.common.component";

export interface ILessonSelectedEventData
{
    lesson_index: number;
    force_reload: boolean;
}

@Component({
    selector: "lesson-select",
    //Needed in nativescript to use relative paths
    moduleId: module.id,
    templateUrl: "./lesson-select.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    //Nativescript needs to depend directly on the processed css
    styleUrls: [ "./lesson-select.component.css" ]
})
export class LessonSelectComponent extends LessonSelectCommonComponent {

}
