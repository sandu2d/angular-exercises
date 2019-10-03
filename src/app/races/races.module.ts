import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { RacesComponent } from './races.component';
import { RaceComponent } from '../race/race.component';
import { PendingRacesComponent } from './pending-races/pending-races.component';
import { FinishedRacesComponent } from './finished-races/finished-races.component';
import { PonyComponent } from '../pony/pony.component';
import { BetComponent } from '../bet/bet.component';
import { LiveComponent } from '../live/live.component';
import { FromNowPipe } from '../from-now.pipe';
import { RACES_ROUTES } from './races.routes';
import { JwtInterceptorService } from '../jwt-interceptor.service';

@NgModule({
  declarations: [
    RacesComponent,
    RaceComponent,
    PendingRacesComponent,
    FinishedRacesComponent,
    PonyComponent,
    BetComponent,
    LiveComponent,
    FromNowPipe
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule.forChild(RACES_ROUTES)
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useExisting: JwtInterceptorService, multi: true }],
})
export class RacesModule { }
