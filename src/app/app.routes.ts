import { Routes } from '@angular/router';
import { RacesComponent } from './races/races.component';
import { HomeComponent } from './home/home.component';

export const ROUTES: Routes = [
    {
        path: 'races',
        component: RacesComponent
    },
    {
        path: '',
        component: HomeComponent
    }
];
