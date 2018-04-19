import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";

import { LessonCommonComponent } from "./lesson.common.component";

import { Page } from "ui/page";
import { Store } from "@ngrx/store";
import { RemoteDataService } from "../../../services/remote_data.common";
import { State } from "../../../sentence/store/reducers";

@Component({
    selector: "Lesson",
    moduleId: module.id,
    templateUrl: "./lesson.component.html"
})
export class LessonComponent extends LessonCommonComponent
    implements OnInit, OnDestroy {
    constructor(
        store: Store<State>,
        remoteData: RemoteDataService,
        private page: Page
    ) {
        super(store, remoteData);

        console.log("LessonComponent constructor");
        //see https://github.com/NativeScript/nativescript-angular/issues/374
        //workaround noOnDestroy not getting called on page unload
        this.page.on(Page.unloadedEvent, event => {
            this.ngOnDestroy();
        });
        this.page.on(Page.loadedEvent, event => {
            this.ngOnInit();
        });
    }

    ngOnInit(): void {
        console.log("Lesson Component on init");
        super.ngOnInit();
    }

    ngOnDestroy(): void {
        console.log("Lesson Component on destroy");
        super.ngOnDestroy();
    }
}
