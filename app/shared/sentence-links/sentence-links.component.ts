
import { Component, ChangeDetectionStrategy } from "@angular/core";

import { SentenceLinksCommonComponent } from "./sentence-links.common.component";

@Component({
    selector: "vocab-sentence-links",
    moduleId: module.id,
    templateUrl: "./sentence-links.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["./sentence-links.component.css"]
})
export class SentenceLinksComponent extends SentenceLinksCommonComponent {}
