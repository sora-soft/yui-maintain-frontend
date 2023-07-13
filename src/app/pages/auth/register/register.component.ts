import { Component, ErrorHandler } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { ServerService } from 'src/app/service/server/server.service';
import {Md5} from 'ts-md5';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  validateForm!: UntypedFormGroup;

  constructor(
    private fb: FormBuilder,
    private server: ServerService,
    private errorHandler: ErrorHandler,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      nickname: [null, [Validators.required]],
      password: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      confirmPassword: [null, [Validators.required]],
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const value = this.validateForm.value;
      this.server.gateway.register({
        username: value.username,
        password: new Md5().appendStr(this.validateForm.value.password).end() as string,
        email: value.email,
        nickname: value.nickname,
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
