import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { USERS_ROUTES } from './users.routes';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MoneyHistoryComponent } from './money-history/money-history.component';

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    MoneyHistoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(USERS_ROUTES),
    SharedModule
  ]
})
export class UsersModule { }
