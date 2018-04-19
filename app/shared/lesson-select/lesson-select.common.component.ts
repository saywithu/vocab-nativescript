import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Lesson } from "../../sentence/models";


export interface ILessonSelectedEventData
{
    lesson_index: number;
    force_reload: boolean;
}

@Component({
    template: "",
})
export class LessonSelectCommonComponent  {

    @Input() lessons: Lesson[];
    @Input() selectedLessonIndex: number;
    @Input() showLoadButtons: boolean = true;

    @Output() lessonSelected = new EventEmitter();
    @Output() gotoLesson = new EventEmitter();
}
