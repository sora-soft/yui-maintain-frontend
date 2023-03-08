import { Component, ErrorHandler } from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {ServerService} from 'src/app/service/server/server.service';
import {Account, IReqFetch} from 'src/app/service/server/api';
import {AuthName} from 'src/app/service/user.service';
import {DataTable} from 'src/app/shared/lib/data-table';
import {EditAccountComponent} from '../edit-account/edit-account.component';

@Component({
  selector: 'app-account-table',
  templateUrl: './account-table.component.html',
  styleUrls: ['./account-table.component.scss']
})
export class AccountTableComponent extends DataTable<Account> {
  AuthName = AuthName;

  constructor(
    private server: ServerService,
    private modal: NzModalService,
    private errorHandler: ErrorHandler,
  ) {
    super('account', server, errorHandler, {
      group: true,
    }, []);
  }

  editAccount(data: Account) {
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
}
