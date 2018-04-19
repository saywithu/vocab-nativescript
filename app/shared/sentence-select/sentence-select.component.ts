import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter
} from "@angular/core";

import { Subject } from "rxjs/Subject";

import * as _ from "lodash";
import { takeUntil } from "rxjs/operators/takeUntil";
import { SentenceSelectCommonComponent } from "./sentence-select.common.component";

@Component({
    selector: "sentence-select",
    //Needed in nativescript to use relative paths
    moduleId: module.id,
    templateUrl: "./sentence-select.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./sentence-select.component.css']
})
export class SentenceSelectComponent extends SentenceSelectCommonComponent {}
