import { Component, ErrorHandler } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {Account} from 'src/app/service/server/api';
import {ServerService} from 'src/app/service/server/server.service';
import {Md5} from 'ts-md5';

@Component({
  selector: 'app-reset-account-password',
  templateUrl: './reset-account-password.component.html',
  styleUrls: ['./reset-account-password.component.scss']
})
export class ResetAccountPasswordComponent {
  account: Account | null = null;


  validateForm: UntypedFormGroup;

  constructor(
    private ref: NzModalRef,
    private fb: UntypedFormBuilder,
    private server: ServerService,
    private errorHandler: ErrorHandler,
  ) {
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      password: ['', [Validators.required]],
    });

    this.ref.updateConfig({
      nzOnOk: () => {
        if (!this.account)
          return;

        if (this.validateForm?.invalid) {
          Object.values(this.validateForm.controls).forEach(control => {
            if (control.invalid) {
              control.markAsDirty();
              control.updateValueAndValidity({ onlySelf: true });
            }
          });
          return;
        }

        console.log(this.validateForm.value.password);
        this.server.auth.resetPassword({
          id: this.account.id,
          password: new Md5().appendStr(this.validateForm.value.password).end() as string,
        }).subscribe({
          next: (res) => {
            this.ref.close(true);
          },
          error: (err) => {
            this.errorHandler.handleError(err);
          }
        });
        return;
      },
    });
  }
}
