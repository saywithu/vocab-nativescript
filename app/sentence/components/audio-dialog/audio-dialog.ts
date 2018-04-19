import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";

import * as _ from "lodash";
import { RemoteDataService } from "../../../services/remote_data.common";
import { ISentence } from "../../models";

@Component({
    selector: "audio-dialog",
    templateUrl: "./audio-dialog.html",
    moduleId: module.id,
    styleUrls: ["audio-dialog.css"]
})
export class AudioDialog {
    prompt: string;
    private status: string;
    private sentence: ISentence;
    private originalSentence: ISentence;

    constructor(
        private params: ModalDialogParams,
        private remoteData: RemoteDataService
    ) {
        this.prompt = params.context.promptMsg;
        this.originalSentence = params.context.sentence;
        this.sentence = _.cloneDeep(this.originalSentence);
    }

    handleSaveAudioTimes() {
        console.log("handleSaveAudioTimes");
        this.status = "Setting audio...";

        this.remoteData
            .updateAudio(this.sentence)
            .subscribe(() => this.close("ok"), ex => (this.status = "error! "));
    }

    changeStop(delta: number) {
        this.sentence.audio_stop_time += delta;
    }

    changeStart(delta: number) {
        this.sentence.audio_start_time += delta;
    }

    close(result: string) {
        this.params.closeCallback(result);
    }
}
