import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";

import { Page } from "ui/page";
import { Store } from "@ngrx/store";
import { RemoteDataService } from "../../../services/remote_data.common";
import { SentenceCommonComponent } from "./sentence.common.component";
import { Logger } from "../../../services/logger";
import { SpeechRecognition } from "../../../services/speech-recognition/speech-recognition";

import {
    ISpeechRecognitionOptions,
    ISpeechRecognitionTranscription
} from "../../../services/speech-recognition/speech-recognition.common";
import { AudioService } from "../../../services/audio/audio";
import { EnumAudioState } from "../../../services/audio/audio.common";
import { State } from "../../store/reducers";

@Component({
    selector: "vocab-sentence",
    moduleId: module.id,
    templateUrl: "./sentence.component.html",
    styleUrls: ["./sentence.component.css"]
})
export class SentenceComponent extends SentenceCommonComponent
    implements OnInit, OnDestroy {
    private showNav: boolean = true;

    constructor(
        store: Store<State>,
        remoteData: RemoteDataService,
        private page: Page,
        logger: Logger,
        private speech: SpeechRecognition,
        private audio: AudioService
    ) {
        super(store, remoteData, logger);

        this.log.debug("Sentence constructor");
        //see https://github.com/NativeScript/nativescript-angular/issues/374
        //workaround noOnDestroy not getting called on page unload
        this.page.on(Page.unloadedEvent, event => {
            this.ngOnDestroy();
        });
        this.page.on(Page.loadedEvent, event => {
            this.ngOnInit();
        });
    }

    async handleRussianTap() {
        this.log.debug("Playing russian sound");

        let permOK = await this.speech.requestPermission();

        if (!permOK) {
            this.editSentence.text_ru = "No perm";
            return;
        }

        let options: ISpeechRecognitionOptions = {
            onResult: (transcription: ISpeechRecognitionTranscription) => {
                this.editSentence.text_ru = transcription.text;
            },
            returnPartialResults: true,
            locale: "ru_RU"
        };
        this.editSentence.text_ru = "...";

        await this.speech.startListening(options);

        this.audio
            .handlePlayAudioTimesObs(
                this.editSentence.audio_file,
                this.editSentence.audio_start_time,
                this.editSentence.audio_stop_time
            )
            .subscribe(as => {
                switch (as) {
                    case EnumAudioState.STARTING:
                        break;

                    case EnumAudioState.STOPPED:
                        setTimeout(() => this.speech.stopListening(), 1000);
                        break;
                }
            });
    }

    toggleNav() {
        this.showNav = !this.showNav;
    }

    ngOnInit(): void {
        this.log.debug("Sentence Component on init");
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        this.log.debug("Sentence Component on destroy");
        super.ngOnDestroy();
    }
}
