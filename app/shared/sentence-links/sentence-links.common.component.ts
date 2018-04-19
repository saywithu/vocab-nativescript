import {
    Component,
    Input,
    OnInit,
    OnChanges

} from "@angular/core";
import { LinkType, tokenize_sentence } from "../../common/utils/String";


@Component({
    template: "",
})
export class SentenceLinksCommonComponent implements OnInit, OnChanges {
    @Input() sentence: string;
    @Input() linkType: LinkType;


    parsed_tokens: String[];

    constructor() {

    }

    ngOnInit() {

    }

    ngOnChanges() {
        this.parsed_tokens = tokenize_sentence(this.sentence);
    }
}
