import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoggedInGuard } from './logged-in.guard';

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'races',
    canActivate: [LoggedInGuard],
    loadChildren: () => import('./races/races.module').then(m => m.RacesModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  }
];
