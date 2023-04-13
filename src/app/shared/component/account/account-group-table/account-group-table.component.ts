import { Component, ErrorHandler } from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ServerService} from 'src/app/service/server/server.service';
import {AuthGroup} from 'src/app/service/server/api';
import {AuthName} from 'src/app/service/user.service';
import {ServerDataTable} from '../../../lib/server-data-table';
import {EditAccountGroupComponent} from '../edit-account-group/edit-account-group.component';
import {UpdateAccountGroupComponent} from '../update-account-group/update-account-group.component';

@Component({
  selector: 'app-account-group-table',
  templateUrl: './account-group-table.component.html',
  styleUrls: ['./account-group-table.component.scss']
})
export class AccountGroupTableComponent extends ServerDataTable<AuthGroup> {
  AuthName = AuthName;

  constructor(
    private server: ServerService,
    private modal: NzModalService,
    private message: NzMessageService,
    private errorHandler: ErrorHandler,
  ) {
    super('auth-group', server, errorHandler, {permissions: true});
  }

  openPermissionModal(data: AuthGroup) {
    console.log(data);
    this.modal.create({
      nzContent: UpdateAccountGroupComponent,
      nzComponentParams: {group: data},
    }).afterClose.subscribe({
      next: (result) => {
        if (result) {
          this.updateData()
        }
      }
    });
  }

  deleteAuthGroup(data: AuthGroup) {
    this.server.auth.deleteAuthGroup({
      gid: data.id,
    }).subscribe({
      next: () => {
        this.message.success('删除权限组成功');
        this.updateData();
      },
      error: (err) => this.errorHandler.handleError(err),
    })
  }

  editGroup(data: AuthGroup) {
    this.modal.create({
      nzContent: EditAccountGroupComponent,
      nzComponentParams: {group: data},
    }).afterClose.subscribe({
      next: () => {this.updateData()}
    })
  }
}
