import { Input, Output, EventEmitter, Component } from "@angular/core";

import { IAudioFile } from "../../models";

export interface IAudioTimeChangedEvent {
    audio_start_time: number;
    audio_stop_time: number;
}

@Component({
    template: "",
})
export class AudioSettingsCommonComponent {
    @Input() startTime: number;
    @Input() stopTime: number;
    @Input() title: string;

    @Output() startTimeChange = new EventEmitter<number>();
    @Output() stopTimeChange = new EventEmitter<number>();

    @Input() audioFile: IAudioFile;

    changeStop(delta: number) {
        this.stopTime = parseFloat(this.stopTime as any);
        this.stopTime += delta;
        this.stopTimeChange.emit(this.stopTime);
    }

    changeStart(delta: number) {
        this.startTime = parseFloat(this.startTime as any);
        this.startTime += delta;
        this.startTimeChange.emit(this.startTime);
    }
}
