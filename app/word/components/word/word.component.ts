import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";

import { Page } from "ui/page";
import { Store } from "@ngrx/store";
import { RemoteDataService } from "../../../services/remote_data.common";
import { WordCommonComponent } from "./word.common.component";
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
    selector: "vocab-word",
    moduleId: module.id,
    templateUrl: "./word.component.html",
    styleUrls: ["./word.component.css"]
})
export class WordComponent extends WordCommonComponent
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

        this.log.debug("Word constructor");
        //see https://github.com/NativeScript/nativescript-angular/issues/374
        //workaround noOnDestroy not getting called on page unload
        this.page.on(Page.unloadedEvent, event => {
            this.ngOnDestroy();
        });
        this.page.on(Page.loadedEvent, event => {
            this.ngOnInit();
        });
    }

    toggleNav() {
        this.showNav = !this.showNav;
    }

    ngOnInit(): void {
        this.log.debug("Word Component on init");
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        this.log.debug("Word Component on destroy");
        super.ngOnDestroy();
    }
}
