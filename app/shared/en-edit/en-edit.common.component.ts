import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";

import { ILogger } from "../../services/logger.common";
import { Logger } from "../../services/logger";

@Component({
    template: "",
})
export class EnEditCommonComponent implements OnInit {
    @Input() enText: string;
    @Output() enTextChange = new EventEmitter<string>();
    @Output() ctrlEnter = new EventEmitter<string>();

    enEditText: string;

    private log: ILogger;

    constructor(logger: Logger) {
        this.log = logger.getLogger(EnEditCommonComponent.name);
    }

    ngOnInit() {
        this.enEditText = this.enText;

    }

    handleEditTextChange(newEnEditText) {
        this.log.debug("text change", newEnEditText);
        this.enEditText = newEnEditText;

        this.enTextChange.emit(this.enEditText);

    }
}
