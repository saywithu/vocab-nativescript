

import { Component, ChangeDetectionStrategy } from "@angular/core";
import { LinkTypeSelectCommonComponent } from "./link-type-select.common.component";
import { LinkType } from "../../common/utils/String";


@Component({
    selector: "vocab-link-type-select",

    templateUrl: "./link-type-select.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["./link-type-select.component.css"]
})
export class LinkTypeSelectComponent extends LinkTypeSelectCommonComponent {

    
}

