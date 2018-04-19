import {
    Component,
    OnInit,
    ViewChild,
    ViewContainerRef,
    OnDestroy
} from "@angular/core";

import { TextField } from "tns-core-modules/ui/text-field";

import * as _ from "lodash";
import { SwipeGestureEventData, SwipeDirection } from "ui/gestures";
import {
    ModalDialogService,
    ModalDialogOptions
} from "nativescript-angular/modal-dialog";
import { SetConfidenceDialogComponent } from "../set-confidence-dialog/set-confidence-dialog";
import { AudioDialog } from "../audio-dialog/audio-dialog";

import { Observable } from "rxjs/Rx";
import { Store } from "@ngrx/store";

import { RemoteDataService } from "../../../services/remote_data.common";
import { Page } from "tns-core-modules/ui/page/page";
import { SentenceQuizCommonComponent } from "./sentence-quiz.common.component";
import { AudioService } from "../../../services/audio/audio";
import { State } from "../../store/reducers";
import { Logger } from "../../../services/logger";

@Component({
    selector: "SentenceQuiz",
    moduleId: module.id,
    templateUrl: "./sentence_quiz.component.html",
    styleUrls: ["sentence_quiz.component.css"]
})
export class SentenceQuizComponent extends SentenceQuizCommonComponent
    implements OnInit, OnDestroy {
    constructor(
        audioService: AudioService,
        remoteDataService: RemoteDataService,
        private modalService: ModalDialogService,
        store: Store<State>,
        viewContainerRef: ViewContainerRef,
        private page: Page,
        logger: Logger
    ) {
        super(audioService, remoteDataService, store, viewContainerRef, logger);

        //see https://github.com/NativeScript/nativescript-angular/issues/374
        //workaround noOnDestroy not getting called on page unload
        this.page.on(Page.unloadedEvent, event => {
            this.ngOnDestroy();
        });
        this.page.on(Page.loadedEvent, event => {
            this.ngOnInit();
        });
    }

    handleShowAudioDialog() {
        const options: ModalDialogOptions = {
            context: {
                sentence: this.editSentence,
                store: this.store
            },
            fullscreen: false,
            viewContainerRef: this.viewContainerRef
        };

        this.modalService.showModal(AudioDialog, options);
    }

    handleShowConfidenceDialog() {
        const options: ModalDialogOptions = {
            context: {
                sentence: this.editSentence
            },
            fullscreen: false,
            viewContainerRef: this.viewContainerRef
        };

        this.modalService.showModal(SetConfidenceDialogComponent, options);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    handleToggleRussian() {
        this.russianVisible = !this.russianVisible;
    }

    handleToggleRussianLongPress() {
        this.alwaysShowRussian = !this.alwaysShowRussian;
    }

    onSwipe(args: SwipeGestureEventData) {
        console.log("Swipe!");
        console.log("Object that triggered the event: " + args.object);
        console.log("View that triggered the event: " + args.view);
        console.log("Event name: " + args.eventName);
        console.log("Swipe Direction: " + args.direction);

        if (args.direction === SwipeDirection.left) {
            // this.handleNext();
        } else if (args.direction === SwipeDirection.right) {
            // this.handlePrev();
        }
    }

    handlePlayAudio(): void {
        this.audioFileService.handlePlayAudio(
            this.editSentence.audio_file,
            this.editSentence
        );
    }

    handleClearText(): void {
        console.log("Clear text");

        //The binding wasn't effective with the IME, so we go native
        this.scratchTextField.nativeElement.nativeViewProtected.clearFocus();
        this.scratchTextField.nativeElement.nativeViewProtected.setText("");
        this.scratchTextField.nativeElement.nativeViewProtected.clearComposingText();
        this.scratchText = "";
    }
}
