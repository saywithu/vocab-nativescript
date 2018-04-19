import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter
} from "@angular/core";

import { AudioService } from "../../services/audio/audio";
import { AudioControlCommonComponent } from "./audio-control.common.component";

@Component({
    selector: "vocab-audio-control",
    templateUrl: "./audio-control.component.html",
    moduleId: module.id
})
export class AudioControlComponent extends AudioControlCommonComponent {}
