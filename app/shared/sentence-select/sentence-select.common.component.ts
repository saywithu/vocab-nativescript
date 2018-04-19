import {
    Component,
    Input,
    Output,
    EventEmitter
} from "@angular/core";
import { ISentence } from "../../sentence/models";

export interface ISentenceSelectedEventData {
    sentence_index: number;
}

@Component({
    template: "",
})
export class SentenceSelectCommonComponent {
    @Input() sentences: ISentence[];
    @Input() selectedSentenceIndex: number;
    @Output() sentenceSelected = new EventEmitter();
}
