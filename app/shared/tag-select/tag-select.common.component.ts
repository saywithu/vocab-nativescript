import {Component, Pipe, PipeTransform} from "@angular/core";
import {ITag} from "../../word/models/word";

export type TagIds = Array<number>;

@Pipe({
    name: "vocabTagFilter",
    pure: false
})
export class VocabTagFilterPipe implements PipeTransform {
    transform(items: Array<ITag>, filter: string): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.name.indexOf(filter) !== -1);
    }
}

@Component({
    template: "",
})
export class TagSelectCommonComponent {

}
