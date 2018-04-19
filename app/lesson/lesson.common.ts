// app
import { SharedModule } from "../shared";
import { RouterModule } from "../common";
import { LESSON_ROUTE_PATH, LESSON_TITLE } from "./lesson.routes";
import { LessonComponent } from "./components/lesson/lesson.component";
import { MenuItem } from "../menu/interfaces/MenuItem";
import { prefix_slash } from "../common/utils/String";
import { buildRoutes } from "../common/utils/AngularHelpers";
import {LessonCommonComponent} from "./components/lesson/lesson.common.component";

export const MENU_ITEM: MenuItem = {
    title: LESSON_TITLE,
    link: [prefix_slash(LESSON_ROUTE_PATH)],
    icon: String.fromCharCode(0xf02d)
};

export const SHARED_MODULES: any[] = [
    SharedModule,
    RouterModule.forChild(buildRoutes(LESSON_ROUTE_PATH, LessonComponent))
];

export const COMPONENT_DECLARATIONS: any[] = [LessonComponent, LessonCommonComponent];

export const COMPONENT_EXPORTS: any[] = [LessonComponent, LessonCommonComponent];
