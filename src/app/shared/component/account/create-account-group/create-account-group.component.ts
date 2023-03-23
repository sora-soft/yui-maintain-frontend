import { Component, ErrorHandler } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {ServerService} from 'src/app/service/server/server.service';

@Component({
  selector: 'app-create-account-group',
  templateUrl: './create-account-group.component.html',
  styleUrls: ['./create-account-group.component.scss']
})
export class CreateAccountGroupComponent {
  validateForm: UntypedFormGroup;

  constructor(
    private ref: NzModalRef,
    private server: ServerService,
    private fb: UntypedFormBuilder,
    private errorHandler: ErrorHandler,
  ) {
    ref.updateConfig({
      nzOnOk: () => {
        if (this.validateForm.invalid) {
          Object.values(this.validateForm.controls).forEach(control => {
            if (control.invalid) {
              control.markAsDirty();
              control.updateValueAndValidity({ onlySelf: true });
            }
          });
          return false;
        }

        this.server.restful.insert({
          db: 'auth-group',
          data: this.validateForm.value,
        }).subscribe({
          next: () => {
            this.ref.close(true);
          },
          error: (err) => {
            this.errorHandler.handleError(err);
          }
        })
        return false;
      },
      nzTitle: '创建用户组'
    })

    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
    });
  }
}
