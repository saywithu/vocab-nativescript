import { LessonSelectComponent } from "./lesson-select/lesson-select.component";
import { AudioControlComponent } from "./audio-control/audio-control.component";
import { SentenceSelectComponent } from "./sentence-select/sentence-select.component";
import { AudioSettingsComponent } from "./audio-settings/audio-settings.component";
import { SentenceLinksComponent } from "./sentence-links/sentence-links.component";
import { LinkTypeSelectComponent } from "./link-type-select/link-type-select.component";
import { RuEditComponent } from "./ru-edit/ru-edit.component";
import { EnEditComponent } from "./en-edit/en-edit.component";
import {TagSelectComponent} from "./tag-select/tag-select.component";
import {TagSelectCommonComponent, VocabTagFilterPipe} from "./tag-select/tag-select.common.component";
import {LessonSelectCommonComponent} from "./lesson-select/lesson-select.common.component";
import {AudioControlCommonComponent} from "./audio-control/audio-control.common.component";
import {SentenceSelectCommonComponent} from "./sentence-select/sentence-select.common.component";
import {AudioSettingsCommonComponent} from "./audio-settings/audio-settings.common.component";
import {LinkTypeSelectCommonComponent} from "./link-type-select/link-type-select.common.component";
import {RuEditCommonComponent} from "./ru-edit/ru-edit.common.component";
import {EnEditCommonComponent} from "./en-edit/en-edit.common.component";
import {SentenceLinksCommonComponent} from "./sentence-links/sentence-links.common.component";


export const COMMON_DECLARATIONS = [
    LessonSelectComponent,
    LessonSelectCommonComponent,
    AudioControlComponent,
    AudioControlCommonComponent,
    SentenceSelectComponent,
    SentenceSelectCommonComponent,
    AudioSettingsComponent,
    AudioSettingsCommonComponent,
    SentenceLinksComponent,
    SentenceLinksCommonComponent,

    LinkTypeSelectComponent,
    LinkTypeSelectCommonComponent,
    RuEditComponent,
    RuEditCommonComponent,
    EnEditComponent,
    EnEditCommonComponent,
    TagSelectComponent,
    TagSelectCommonComponent,
    VocabTagFilterPipe

];
