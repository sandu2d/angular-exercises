import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../models/user.model';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  loginCtrl: FormControl;
  passwordCtrl: FormControl;
  birthYearCtrl: FormControl;
  confirmPasswordCtrl: FormControl;

  userForm: FormGroup;
  passwordForm: FormGroup;

  user: UserModel;

  registrationFailed = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  static passwordMatch(fg: FormGroup) {
    return fg.controls.password.value !== fg.controls.confirmPassword.value
      ? { matchingError: true }
      : null;
  }

  ngOnInit() {
    this.loginCtrl = this.fb.control('', [Validators.required, Validators.minLength(3)]);
    this.passwordCtrl = this.fb.control('', Validators.required);
    this.birthYearCtrl = this.fb.control('', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]);
    this.confirmPasswordCtrl = this.fb.control('', Validators.required);

    this.passwordForm = this.fb.group({
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl
    }, {
      validator: (formGroup: FormGroup) => {
        return RegisterComponent.passwordMatch(formGroup);
      }
    });

    this.userForm = this.fb.group({
      login: this.loginCtrl,
      passwordForm: this.passwordForm,
      birthYear: this.birthYearCtrl
    });
  }

  register() {
    this.userService.register(
      this.loginCtrl.value,
      this.passwordCtrl.value,
      this.birthYearCtrl.value
    ).subscribe(user => {
      this.user = user;
      this.router.navigate(['/']);
    },
    error => {
      this.registrationFailed = true;
    });
  }
}
