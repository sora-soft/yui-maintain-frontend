import { Component, ErrorHandler } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {ServerService} from 'src/app/service/server.service';
import {AuthGroup} from 'src/app/service/server/api';

@Component({
  selector: 'app-edit-account-group',
  templateUrl: './edit-account-group.component.html',
  styleUrls: ['./edit-account-group.component.scss']
})
export class EditAccountGroupComponent {
  validateForm: UntypedFormGroup;

  group: AuthGroup | null = null;

  constructor(
    private ref: NzModalRef,
    private server: ServerService,
    private fb: UntypedFormBuilder,
    private errorHandler: ErrorHandler,
  ) {

    ref.updateConfig({
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

        this.server.restful.update({
          db: 'auth-group',
          where: {id: this.group?.id},
          data: this.validateForm?.value,
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
      nzTitle: '修改用户组名称'
    })
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      name: [this.group?.name, [Validators.required]],
    });
  }
}
