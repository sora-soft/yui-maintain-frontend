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
import { MonitorComponent } from './monitor/monitor.component';
import { NodeListComponent } from './monitor/node/node-list/node-list.component';
import { NodeDetailComponent } from './monitor/node/node-detail/node-detail.component';
import { NodeBasicComponent } from './monitor/node/node-detail/node-basic/node-basic.component';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { MomentModule } from 'ngx-moment';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import { NodeRunnersComponent } from './monitor/node/node-detail/node-runners/node-runners.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ServiceListComponent } from './monitor/service/service-list/service-list.component';
import { ServiceDetailComponent } from './monitor/service/service-detail/service-detail.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import {NzTableModule} from 'ng-zorro-antd/table';
import { ListenerDetailComponent } from './monitor/listener/listener-detail/listener-detail.component';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NodeComponentsComponent } from './monitor/node/node-detail/node-components/node-components.component';
import { NodeProvidersComponent } from './monitor/node/node-detail/node-providers/node-providers.component';
import { NzSpaceModule } from 'ng-zorro-antd/space';

@NgModule({
  declarations: [
    BusinessComponent,
    DashboardComponent,
    AccountComponent,
    AccountListComponent,
    GroupListComponent,
    MonitorComponent,
    NodeListComponent,
    NodeDetailComponent,
    NodeBasicComponent,
    NodeRunnersComponent,
    ServiceListComponent,
    ServiceDetailComponent,
    ListenerDetailComponent,
    NodeComponentsComponent,
    NodeProvidersComponent,
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
    NzStatisticModule,
    MomentModule,
    NzDescriptionsModule,
    NzBadgeModule,
    NzTagModule,
    NzCardModule,
    NzTableModule,
    NzProgressModule,
    NzSpaceModule,
  ],
  providers: [BusinessCanActivate]
})
export class BusinessModule { }
