import {
    Component,
    ChangeDetectionStrategy,
    Input,
    Output,
    EventEmitter
} from "@angular/core";

import { AudioSettingsCommonComponent } from "./audio-settings.common.component";

@Component({
    selector: "vocab-audio-settings",
    //Needed in nativescript to use relative paths
    moduleId: module.id,
    templateUrl: "./audio-settings.component.html",
    //changeDetection: ChangeDetectionStrategy.OnPush,
    //Nativescript needs to depend directly on the processed css
    styleUrls: ["./audio-settings.component.css"]
})
export class AudioSettingsComponent extends AudioSettingsCommonComponent {}
