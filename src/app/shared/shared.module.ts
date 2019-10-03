import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { FormControlValidationDirective } from './form-control-validation.directive';
import { FormLabelDirective } from './form-label.directive';
import { FormLabelValidationDirective } from './form-label-validation.directive';
import { NgbAlertModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AlertComponent,
    FormControlValidationDirective,
    FormLabelDirective,
    FormLabelValidationDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlertComponent,
    FormControlValidationDirective,
    FormLabelDirective,
    FormLabelValidationDirective,
    NgbAlertModule,
    NgbPaginationModule
  ]
})
export class SharedModule { }
