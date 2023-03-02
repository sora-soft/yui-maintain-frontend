import { Component, ViewChild } from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal'
import {AuthName} from 'src/app/service/user.service';
import {AccountGroupTableComponent} from 'src/app/shared/component/account/account-group-table/account-group-table.component';
import {CreateAccountGroupComponent} from 'src/app/shared/component/account/create-account-group/create-account-group.component';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent {
  AuthName = AuthName;

  @ViewChild(AccountGroupTableComponent)
  table: AccountGroupTableComponent | null = null;

  constructor(
    private modal: NzModalService,
  ) { }

  createAccountGroup() {
    this.modal.create({
      nzContent: CreateAccountGroupComponent
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
