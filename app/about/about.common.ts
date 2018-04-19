// vendor dependencies

// app
import { SharedModule } from '../shared';
import { RouterModule } from '../common';
import { AboutRoutes } from './about.routes';
import { AboutComponent } from './components/about/about.component';

export const SHARED_MODULES: any[] = [
    SharedModule,
    RouterModule.forChild(<any>AboutRoutes),
    
];

export const COMPONENT_DECLARATIONS: any[] = [
    AboutComponent
];
