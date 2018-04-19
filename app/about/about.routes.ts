import { Routes } from '@angular/router';
// app
import { AboutComponent } from './components/about/about.component';

export const ABOUT_ROUTE_PATH = 'about';

export const AboutRoutes: Routes = [
    {
        path: ABOUT_ROUTE_PATH,
        component: AboutComponent
    }
];
