import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter
} from "@angular/core";

import { RuEditCommonComponent } from "./ru-edit.common.component";

@Component({
    selector: "vocab-ru-edit",
    moduleId: module.id,
    templateUrl: "./ru-edit.component.html",

    styleUrls: ["./ru-edit.component.css"]
})
export class RuEditComponent extends RuEditCommonComponent {}
