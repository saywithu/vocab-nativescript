import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter
} from "@angular/core";


import { TagSelectCommonComponent } from "./tag-select.common.component";

@Component({
    selector: "vocab-tag-select",
    //Needed in nativescript to use relative paths
    moduleId: module.id,
    templateUrl: "./tag-select.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./tag-select.component.css']
})
export class TagSelectComponent extends TagSelectCommonComponent {}
