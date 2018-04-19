import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { RemoteDataService } from "../../../services/remote_data.common";
import * as _ from "lodash";
import { Store } from "@ngrx/store";
import { ISentence } from "../../models";

@Component({
    selector: "set-confidence-dialog",
    templateUrl: "./set-confidence-dialog.html",
    moduleId: module.id,
    providers: [],
    styleUrls: ["set-confidence-dialog.css"]
})
export class SetConfidenceDialogComponent {
    prompt: string;
    private status: string;
    private sentence: ISentence;

    constructor(
        private params: ModalDialogParams,
        private remoteData: RemoteDataService
    ) {
        this.prompt = params.context.promptMsg;
        this.sentence = params.context.sentence;
    }

    get confidenceLevels() {
        return [
            "Unknown",
            "Can read",
            "Getting there",
            "Most words",
            "Pronunciation",
            "Spelling & Pronunciation"
        ];
    }

    async handleSetConfidence(confidenceLevel: number) {
        console.log("handleSetConfidence", confidenceLevel, this.sentence.id);
        this.status = "Setting confidence...";
        let sCopy = _.cloneDeep(this.sentence);
        sCopy.known_confidence = confidenceLevel;
        this.remoteData
            .updateConfidence(sCopy)
            .subscribe(
                () => this.close("ok"),
                err => (this.status = "Confidence error! " + err)
            );
    }

    close(result: string) {
        this.params.closeCallback(result);
    }
}
