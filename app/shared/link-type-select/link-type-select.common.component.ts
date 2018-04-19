import {
    Component,
    Input,
    Output,
    EventEmitter
} from "@angular/core";
import { LinkType } from "../../common/utils/String";

@Component({
    template: "",
})
export class LinkTypeSelectCommonComponent {
    @Input() linkType: LinkType;
    @Output() linkTypeChange = new EventEmitter<LinkType>();


    linkTypeList(): Array<LinkType> {
        return LinkType.getAll();
    }
}
