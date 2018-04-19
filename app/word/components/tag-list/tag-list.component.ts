import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";

import { Page } from "ui/page";
import { Store } from "@ngrx/store";
import { RemoteDataService } from "../../../services/remote_data.common";
import {TagListCommonComponent} from "./tag-list.common.component";
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
    selector: 'vocab-tag-list',
    moduleId: module.id,
    
    templateUrl: './tag-list.component.html',
    styleUrls: ["./tag-list.component.css"]
})
export class TagListComponent extends TagListCommonComponent
    implements OnInit, OnDestroy {
    private showNav: boolean = true;

    constructor(
        store: Store<State>,
        remoteData: RemoteDataService,
        private page: Page,
        logger: Logger,
        
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
        this.log.debug("TagList Component on init");
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        this.log.debug("TagList Component on destroy");
        super.ngOnDestroy();
    }
}
