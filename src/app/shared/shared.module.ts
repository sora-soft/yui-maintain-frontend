import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { AccountTableComponent } from './component/account/account-table/account-table.component';
import { AccountGroupTableComponent } from './component/account/account-group-table/account-group-table.component';
import { CreateAccountGroupComponent } from './component/account/create-account-group/create-account-group.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import {NzFormModule} from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import { UpdateAccountGroupComponent } from './component/account/update-account-group/update-account-group.component';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import {NzMessageServiceModule} from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { EditAccountGroupComponent } from './component/account/edit-account-group/edit-account-group.component';
import { EditAccountComponent } from './component/account/edit-account/edit-account.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CreateAccountComponent } from './component/account/create-account/create-account.component';
import { AuthDirective } from './directive/auth.directive';
import { NzTagModule } from 'ng-zorro-antd/tag';

@NgModule({
  declarations: [
    AccountTableComponent,
    AccountGroupTableComponent,
    CreateAccountGroupComponent,
    UpdateAccountGroupComponent,
    EditAccountGroupComponent,
    EditAccountComponent,
    CreateAccountComponent,
    AuthDirective,
  ],
  imports: [
    CommonModule,
    NzModalModule,
    NzCardModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzTableModule,
    NzCollapseModule,
    NzListModule,
    NzRadioModule,
    NzMessageServiceModule,
    NzPopconfirmModule,
    NzSelectModule,
    NzTagModule,
  ],
  exports: [
    AccountTableComponent,
    AccountGroupTableComponent,
    CreateAccountGroupComponent,
    EditAccountGroupComponent,
    AuthDirective,
  ]
})
export class SharedModule { }
