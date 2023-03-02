import { Component, ErrorHandler } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {ServerService} from 'src/app/service/server.service';
import {AuthGroupService} from 'src/app/service/auth-group.service';
import {Account, AuthGroup} from 'src/app/service/server/api';
import {Md5} from 'ts-md5';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent {
  account: Account | null = null;

  validateForm: UntypedFormGroup;

  authGroupList: AuthGroup[];

  constructor(
    private ref: NzModalRef,
    private fb: UntypedFormBuilder,
    private server: ServerService,
    private authGroup: AuthGroupService,
    private errorHandler: ErrorHandler,
  ) {
    authGroup.$authGroup.subscribe({
      next: (list) => {
        this.authGroupList = list;
      }
    });
  }

  ngOnInit() {
    if (this.account) {
      this.validateForm = this.fb.group({
        nickname: [this.account?.nickname, [Validators.required]],
        email: [this.account?.email, [Validators.required]],
        gid: [this.account?.gid],
      });
    } else {
      this.validateForm = this.fb.group({
        username: [null, [Validators.required]],
        password: [null, [Validators.required]],
        nickname: [null, [Validators.required]],
        email: [null, [Validators.required]],
        gid: [null, [Validators.required]],
      });
    }

    this.ref.updateConfig({
      nzOnOk: () => {
        if (this.validateForm?.invalid) {
          Object.values(this.validateForm.controls).forEach(control => {
            if (control.invalid) {
              control.markAsDirty();
              control.updateValueAndValidity({ onlySelf: true });
            }
          });
          return false;
        }

        if (this.account) {
          const value = this.validateForm.value;
          this.server.auth.updateAccount({
            accountId: this.account.id,
            nickname: value.nickname,
            email: value.email,
            gid: value.gid,
          }).subscribe({
            next: () => {
              this.ref.close(true);
            },
            error: (err) => {
              this.errorHandler.handleError(err);
            }
          });
        } else {
          this.server.auth.createAccount({
            ...this.validateForm?.value,
            password: new Md5().appendStr(this.validateForm.value.password).end(),
          }).subscribe({
            next: () => {
              this.ref.close(true);
            },
            error: (err) => {
              this.errorHandler.handleError(err);
            }
          });
        }
        return false;
      },
    });
  }
}
