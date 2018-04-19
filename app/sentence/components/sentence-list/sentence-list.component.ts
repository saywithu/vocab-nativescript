import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";

import { SentenceListCommonComponent } from "./sentence-list.common.component";
import { Page } from "tns-core-modules/ui/page/page";
import { Store } from "@ngrx/store";
import { State } from "../../store/reducers";
import { RemoteDataService } from "../../../services/remote_data.common";
import { Logger } from "../../../services/logger";

@Component({
    selector: "SentenceList",
    moduleId: module.id,
    templateUrl: "./sentence-list.component.html"
})
export class SentenceListComponent extends SentenceListCommonComponent implements OnInit, OnDestroy
{
    constructor(store: Store<State>, remoteData: RemoteDataService,
        logger: Logger, private page: Page)
    {
        super(store, remoteData, logger);

        console.log("SentenceComponent constructor");
        //see https://github.com/NativeScript/nativescript-angular/issues/374
        //workaround noOnDestroy not getting called on page unload
        this.page.on(Page.unloadedEvent, (event) =>
        {
            this.ngOnDestroy();
        });
        this.page.on(Page.loadedEvent, (event) =>
        {
            this.ngOnInit();
        });
    }

    ngOnInit(): void
    {
        console.log("SentenceList Component on init");
        super.ngOnInit();
    }

    ngOnDestroy(): void
    {
        console.log("SentenceList Component on destroy");
        super.ngOnDestroy();
    }

}
