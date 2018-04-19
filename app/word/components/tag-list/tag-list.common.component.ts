import { Component, OnInit, OnDestroy } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Store, select } from "@ngrx/store";
import * as WordModuleActions from "../../store/actions";
import * as _ from "lodash";

import { takeUntil } from "rxjs/operators/takeUntil";
import { RemoteDataService } from "../../../services/remote_data.common";

import { Logger } from "../../../services/logger";
import { ILogger } from "../../../services/logger.common";
import { TAG_LIST_TITLE } from "../../word.routes";
import { ITag } from "../../models/word";
import {
    State,
    getAllTags,
    selectStatus,
    getSelectedTagIds
} from "../../store/reducers";

@Component({
    template: '',
})
export class TagListCommonComponent implements OnInit, OnDestroy {
    private ngUnsubscribe: Subject<any>;


    tagList$: Observable<Array<ITag>>;
    selectedTagIds$: Observable<Array<number>>;

    appStatus: Observable<string>;

    newTagName: string = "";

    private isLoaded: boolean = false;
    protected localStatus: string = "...";

    protected log: ILogger;

    constructor(
        private store: Store<State>,
        private remoteData: RemoteDataService,
        protected logger: Logger
    ) {
        this.log = this.logger.getLogger(TagListCommonComponent.name);
        this.log.debug("TagComponentCommon constructor");
    }

    ngOnInit(): void {
        this.log.debug("ngOnInit Tag base");
        if (this.isLoaded) {
            this.log.debug("Already loaded, returning...");
            return;
        }
        this.ngUnsubscribe = new Subject();

        this.localStatus = "Fetching Tags...";
        this.tagList$ = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(getAllTags)
        );
        this.appStatus = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(selectStatus)
        );

        this.tagList$ = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(getAllTags)
        );
        this.selectedTagIds$ = this.store.pipe(
            takeUntil(this.ngUnsubscribe),
            select(getSelectedTagIds)
        );
    }

    ngOnDestroy(): void {
        this.isLoaded = false;
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    get title(): string {
        return TAG_LIST_TITLE;
    }

    handleDeleteTag(tag: ITag) {
        this.store.dispatch(new WordModuleActions.DeleteTag(tag));
    }

    handleNewTag(event) {
        this.log.debug("new tag", event, this.newTagName);
        this.store.dispatch(new WordModuleActions.NewTag( {name: this.newTagName } ));
    }
}
