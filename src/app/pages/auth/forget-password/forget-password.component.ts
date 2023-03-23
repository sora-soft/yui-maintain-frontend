import { Component, ErrorHandler } from '@angular/core';
import {FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ServerService} from 'src/app/service/server/server.service';
import {UserService} from 'src/app/service/user.service';
import {Md5} from 'ts-md5';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {
  validateForm!: UntypedFormGroup;

  hasSent?: string;
  coldDown = 0;

  constructor(
    private fb: UntypedFormBuilder,
    private server: ServerService,
    private errorHandler: ErrorHandler,
    private router: Router,
  ) {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      code: [null, [Validators.required]],
      password: [null, [Validators.required]],
      passwordConfirm: [null, Validators.required],
      id: ['', Validators.required],
    }, {
      validators: this.checkPass
    });
  }

  startColdDown() {
    this.coldDown = 60;
    setInterval(() => {
      this.coldDown -= 1;
    }, 1000);
  }

  checkPass(group: FormGroup) {
    const password = group.get('password')?.value;
    const passwordConfirm = group.get('passwordConfirm')?.value;

    return password === passwordConfirm ? null : { notSame: true };
  }

  requestForgetPass() {
    const email = this.validateForm.value.email;
    if (!email)
      return;

    this.startColdDown();
    this.server.auth.requestForgetPassword({
      email
    }).subscribe({
      next: (res) => {
        this.hasSent = email;
        this.validateForm.patchValue({id: res.id});
      },
      error: (err) => {
        this.errorHandler.handleError(err);
      }
    })
  }

  submitForm() {
    if (this.validateForm.valid) {
      const value = this.validateForm.value;
      this.server.auth.forgetPassword({
        id: value.id,
        code: value.code,
        password: new Md5().appendStr(this.validateForm.value.password).end() as string,
      }).subscribe({
        next: (res) => {
          this.router.navigate(['/auth/login']);
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
