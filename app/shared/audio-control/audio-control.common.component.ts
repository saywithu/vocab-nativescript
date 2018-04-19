import { Component, Input } from "@angular/core";

import * as _ from "lodash";
import { AudioService } from "../../services/audio/audio";
import { Subscription } from "rxjs/Subscription";
import { IAudioFile } from "../../models";

@Component({
    template: ""
})
export class AudioControlCommonComponent {
    @Input() audioFile: IAudioFile;
    @Input() audio_start_time: number;
    @Input() audio_stop_time: number;

    private obs: Subscription;

    constructor(private audioService: AudioService) {}

    handlePlay() {
        if (this.obs) {
            this.obs.unsubscribe();
        }

        this.obs = this.audioService
            .handlePlayAudioTimesObs(
                this.audioFile,
                this.audio_start_time,
                this.audio_stop_time
            )
            .subscribe();
    }

    handleStop() {
        if (this.obs) {
            this.obs.unsubscribe();
        }
    }
}
