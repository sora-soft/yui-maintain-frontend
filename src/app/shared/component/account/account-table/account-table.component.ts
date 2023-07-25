import { Component, ErrorHandler } from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {ServerService} from 'src/app/service/server/server.service';
import {Account, IReqFetch} from 'src/app/service/server/api';
import {AuthName, UserService} from 'src/app/service/user.service';
import {ServerDataTable} from 'src/app/shared/lib/server-data-table';
import {EditAccountComponent} from '../edit-account/edit-account.component';
import {ResetAccountPasswordComponent} from '../reset-account-password/reset-account-password.component';

@Component({
  selector: 'app-account-table',
  templateUrl: './account-table.component.html',
  styleUrls: ['./account-table.component.scss']
})
export class AccountTableComponent extends ServerDataTable<Account> {
  AuthName = AuthName;

  constructor(
    private server: ServerService,
    private modal: NzModalService,
    private errorHandler: ErrorHandler,
    public user: UserService,
  ) {
    super('account', server, errorHandler, {
      groupList: true,
    }, []);
  }

  editAccount(data: Account) {
    if (data.id === this.user.accountId)
      return;

    this.modal.create({
      nzContent: EditAccountComponent,
      nzComponentParams: {account: data},
      nzTitle: '编辑账号',
    }).afterClose.subscribe({
      next: (result) => {
        if (result)
          this.updateData();
      }
    })
  }

  disableAccount(data: Account) {
    if (data.id === this.user.accountId)
      return;

    this.server.auth.disableAccount({
      accountId: data.id,
      disabled: !data.disabled,
    }).subscribe({
      next: () => {
        this.updateData();
      },
      error: (err) => {
        this.errorHandler.handleError(err);
      }
    })
  }

  resetPassword(data: Account) {
    this.modal.create({
      nzContent: ResetAccountPasswordComponent,
      nzComponentParams: {account: data},
      nzTitle: '重设账号密码'
    }).afterClose.subscribe({
      next: () => {}
    })
  }

  accountAuthGroupName(list?: {name: string}[]) {
    if (!list) {
      return '';
    }
    return list.map(l => l.name).join(',');
  }
}
