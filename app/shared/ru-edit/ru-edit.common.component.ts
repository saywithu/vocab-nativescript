import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { un_transliterate, transliterate, RUSSIAN_ALPHABET_TRANSLITERATED, RUSSIAN_ALPHABET } from "../../common/utils/String";
import { ILogger } from "../../services/logger.common";
import { Logger } from "../../services/logger";

@Component({
    template: "",
})
export class RuEditCommonComponent implements OnInit {
    @Input() ruText: string;

    @Output() ruTextChange = new EventEmitter<string>();
    @Output() ctrlEnter = new EventEmitter<string>();

    ruEditTextTr: string;
    ruEditText: string;

    russianAlpha = RUSSIAN_ALPHABET;
    russianAlphaTr = RUSSIAN_ALPHABET_TRANSLITERATED;
    TOOLTIP_TABLE_ROWS = 7

    private log: ILogger;

    constructor(logger: Logger) {
        this.log = logger.getLogger(RuEditCommonComponent.name);
    }

    ngOnInit() {
        this.ruEditText = this.ruText;
        this.ruEditTextTr = un_transliterate(this.ruText);
    }

    handleEditTextTrChange(newRuEditTextTr) {
        this.log.debug("text change", newRuEditTextTr);
        this.ruEditTextTr = newRuEditTextTr;
        this.ruEditText = transliterate(this.ruEditTextTr);

        this.ruTextChange.emit(this.ruEditText);

    }



}
