import { Component, ViewChild } from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {AuthName} from 'src/app/service/user.service';
import {AccountTableComponent} from 'src/app/shared/component/account/account-table/account-table.component';
import {EditAccountComponent} from 'src/app/shared/component/account/edit-account/edit-account.component';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent {
  AuthName = AuthName;

  @ViewChild(AccountTableComponent)
  table: AccountTableComponent | null = null;

  constructor(
    private modal: NzModalService,
  ) { }

  createAccount() {
    this.modal.create({
      nzContent: EditAccountComponent,
      nzTitle: '创建账号'
    }).afterClose.subscribe({
      next: (result) => {
        if (result && this.table) {
          this.table.updateData();
        }
      }
    });
  }

  updateData() {
    this.table?.updateData();
  }
}
