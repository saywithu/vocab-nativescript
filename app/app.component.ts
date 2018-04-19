import { Component } from "@angular/core";
// vendor dependencies

// app
import { MenuItem } from "./menu/menu.common";

// import { LESSON_ROUTE_PATH } from "./lesson/lesson.routes";
import { ABOUT_ROUTE_PATH } from "./about/about.routes";
// import { SENTENCE_QUIZ_PATH } from "./sentence-quiz/sentence-quiz.routes";

import { MENU_ITEM as LESSON_MENU_ITEM } from "./lesson/lesson.common";

import { prefix_slash } from "./common/utils/String";
import { Logger } from "./services/logger";
import { MetaReducerLogger } from "./services/reducer_logger";
import { LogLevel } from "./services/logger.common";
import { SENTENCE_MENU_ITEM, SENTENCE_LIST_MENU_ITEM, SENTENCE_QUIZ_MENU_ITEM } from "./sentence/sentence.common";
import { WORD_LIST_MENU_ITEM, TAG_LIST_MENU_ITEM } from "./word/word.common";
import {QUESTION_LIST_MENU_ITEM} from "./question/question.common";


@Component({
    moduleId: module.id,
    selector: "vocab-app",
    templateUrl: "./app.component.html"
})
export class AppComponent {
    static menuItems: Array<MenuItem> = [
        SENTENCE_MENU_ITEM,
        SENTENCE_LIST_MENU_ITEM,
        LESSON_MENU_ITEM,
        QUESTION_LIST_MENU_ITEM,
        SENTENCE_QUIZ_MENU_ITEM,
        WORD_LIST_MENU_ITEM,
        TAG_LIST_MENU_ITEM,
        {
            title: "About",
            link: [prefix_slash(ABOUT_ROUTE_PATH)],
            icon: String.fromCharCode(0xf129)
        }
    ];

    get menuItems(): Array<MenuItem> {
        return AppComponent.menuItems;
    }

    constructor(log: Logger, mrl: MetaReducerLogger) {
        log.logMessage("Starting app", AppComponent.name, LogLevel.DEBUG, null);
    }
}
