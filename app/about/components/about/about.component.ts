import {
    DrawerTransitionBase,
    SlideInOnTopTransition
} from "nativescript-pro-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-pro-ui/sidedrawer/angular";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Logger, ILogEntry } from "../../../services/logger";
import { Page } from "tns-core-modules/ui/page/page";
import { ScrollView } from "ui/scroll-view";

@Component({
    moduleId: module.id,
    selector: "vocab-about",
    templateUrl: "./about.component.html",
    styleUrls: ["./about.component.scss"]
})
export class AboutComponent implements OnInit {
    private logEntries: Array<ILogEntry>;
    @ViewChild("logScroll") logScrollRef: ElementRef;

    constructor(private log: Logger, private page: Page) {
        this.logEntries = log.logEntries;

        this.page.on(Page.unloadedEvent, event => {
            //this.ngOnDestroy();
        });
        this.page.on(Page.loadedEvent, event => {
            this.ngOnInit();
        });
    }

    handleLogClick() {
        let logScroll: ScrollView = this.logScrollRef.nativeElement;
        logScroll.scrollToVerticalOffset(logScroll.scrollableHeight, true);
    }

    ngOnInit(): void {}
}
