/* tslint:disable:directive-selector */

import { Directive, ContentChild, AfterContentInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormLabelDirective } from './form-label.directive';

@Directive({
  selector: '.form-group'
})
export class FormLabelValidationDirective implements AfterContentInit {

  @ContentChild(NgControl, {static: false}) ngControl !: NgControl;
  @ContentChild(FormLabelDirective, {static: false}) label !: FormLabelDirective;

  constructor() { }

  setLabelValidity() {
    if (this.ngControl.dirty && this.ngControl.invalid) {
      this.label.isInvalid = true;
    } else {
      this.label.isInvalid = false;
    }
  }

  ngAfterContentInit() {
    if (this.ngControl && this.label) {
      this.setLabelValidity();

      this.ngControl.statusChanges.subscribe(() => {
        this.setLabelValidity();
      });
    }
  }

}
