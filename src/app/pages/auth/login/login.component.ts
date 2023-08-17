import { Component, ErrorHandler } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import {AccountLoginType} from 'src/app/service/server/api';
import { ServerService } from 'src/app/service/server/server.service';
import { UserService } from 'src/app/service/user.service';
import {Md5} from 'ts-md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  validateForm!: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private server: ServerService,
    private errorHandler: ErrorHandler,
    private user: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const emailTest = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      this.server.auth.login({
        type: emailTest.test(this.validateForm.value.username) ? AccountLoginType.EMAIL : AccountLoginType.USERNAME,
        ...this.validateForm.value,
        password: new Md5().appendStr(this.validateForm.value.password).end(),
      }).subscribe({
        next: (res) => {
          this.user.login(res.account, res.permissions, res.authorization.token, res.authorization.expireAt);
          this.router.navigate(['/business/']);
        },
        error: (err) => {
          this.errorHandler.handleError(err);
        }
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
