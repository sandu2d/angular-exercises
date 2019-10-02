import { Routes } from '@angular/router';
import { RacesComponent } from './races/races.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { BetComponent } from './bet/bet.component';
import { LiveComponent } from './live/live.component';
import { LoggedInGuard } from './logged-in.guard';

export const ROUTES: Routes = [
  {
    path: 'races',
    children: [
      {
        path: '',
        component: RacesComponent
      },
      {
        path: ':raceId',
        component: BetComponent
      },
      {
        path: ':raceId/live',
        component: LiveComponent
      }
    ],
    canActivate: [LoggedInGuard]
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];
