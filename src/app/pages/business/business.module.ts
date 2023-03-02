import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessRoutingModule } from './business-routing.module';
import { BusinessComponent } from './business.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountComponent } from './account/account.component';
import { AccountListComponent } from './account/account-list/account-list.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SharedModule } from '../../shared/shared.module';
import { GroupListComponent } from './account/group-list/group-list.component';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import {BusinessCanActivate} from './business-can-activate';

@NgModule({
  declarations: [
    BusinessComponent,
    DashboardComponent,
    AccountComponent,
    AccountListComponent,
    GroupListComponent,
  ],
  imports: [
    CommonModule,
    BusinessRoutingModule,
    NzLayoutModule,
    NzFormModule,
    NzMenuModule,
    NzIconModule,
    NzGridModule,
    NzButtonModule,
    SharedModule,
    NzModalModule,
    NzDropDownModule,
    NzAvatarModule,
  ],
  providers: [BusinessCanActivate]
})
export class BusinessModule { }
