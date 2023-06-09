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
import { ConfigComponent } from './config/config.component';
import { ConfigListComponent } from './config/config-list/config-list.component';
import { EditConfigComponent } from './config/edit-config/edit-config.component';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzInputModule} from 'ng-zorro-antd/input';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import {NzSelectModule} from 'ng-zorro-antd/select';
import { ClusterListComponent } from './monitor/cluster/cluster-list/cluster-list.component';
import { ClusterDetailComponent } from './monitor/cluster/cluster-detail/cluster-detail.component';
import { ClusterNodesComponent } from './monitor/cluster/cluster-detail/cluster-nodes/cluster-nodes.component';
import { ClusterRunnersComponent } from './monitor/cluster/cluster-detail/cluster-runners/cluster-runners.component';

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
    ConfigComponent,
    ConfigListComponent,
    EditConfigComponent,
    ClusterListComponent,
    ClusterDetailComponent,
    ClusterNodesComponent,
    ClusterRunnersComponent,
  ],
  imports: [
    CommonModule,
    BusinessRoutingModule,
    NzLayoutModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
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
    NzPageHeaderModule,
    MonacoEditorModule,
    NzSelectModule,
  ],
  providers: [BusinessCanActivate]
})
export class BusinessModule { }
