import { Routes } from '@angular/router';
import { SENTENCE_ROUTE_PATH } from './sentence/sentence.routes';
/**
 * Define app module routes here, e.g., to lazily load a module
 * (do not place feature module routes here, use an own -routing.module.ts in the feature instead)
 */

export const APP_ROUTES: Routes = [
   // { path: "", redirectTo: `/${SENTENCE_LIST_ROUTE_PATH}`, pathMatch: "full" }
   { path: "", redirectTo: `/${SENTENCE_ROUTE_PATH}`, pathMatch: "full" }
];
