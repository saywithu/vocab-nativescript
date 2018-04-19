import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy,
    Input,
    Output
} from "@angular/core";

import { EnEditCommonComponent } from "./en-edit.common.component";

@Component({
    selector: "vocab-en-edit",
    moduleId: module.id,
    templateUrl: "./en-edit.component.html",
    //changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["./en-edit.component.css"]
})
export class EnEditComponent extends EnEditCommonComponent {}
