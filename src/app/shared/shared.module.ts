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
import { AuthDirective } from './directive/auth.directive';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NodeTableComponent } from './component/node/node-table/node-table.component';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { WorkerStateBadgeComponent } from './component/common/worker-state-badge/worker-state-badge.component';
import { MomentModule } from 'ngx-moment';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {RouterModule} from '@angular/router';
import { VersionChipComponent } from './component/common/version-chip/version-chip.component';
import { RunnerTableComponent } from './component/runner/runner-table/runner-table.component';
import { ListenerStateBadgeComponent } from './component/common/listener-state-badge/listener-state-badge.component';
import { LabelStringfiyPipe } from './pipe/label-stringfiy.pipe';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { JsonOptionsTreeComponent } from './component/common/json-options-tree/json-options-tree.component';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ProviderTableComponent } from './component/node/provider-table/provider-table.component';
import { ConnectorStateBadgeComponent } from './component/common/connector-state-badge/connector-state-badge.component';
import { FilterStringfiyPipe } from './pipe/filter-stringfiy.pipe';
import {NzProgressModule} from 'ng-zorro-antd/progress';
import { ConfigTableComponent } from './component/config/config-table/config-table.component';
import { CreateConfigComponent } from './component/config/create-config/create-config.component';
import { ClusterCardComponent } from './component/cluster/cluster-card/cluster-card.component';
import {NzDescriptionsModule} from 'ng-zorro-antd/descriptions';
import {NzSpaceModule} from 'ng-zorro-antd/space';
import { ClusterBreadcrumbComponent } from './component/cluster/cluster-breadcrumb/cluster-breadcrumb.component';
import { NetworkStateComponent } from './component/common/network-state/network-state.component';
import { ResetAccountPasswordComponent } from './component/account/reset-account-password/reset-account-password.component';

@NgModule({
  declarations: [
    AccountTableComponent,
    AccountGroupTableComponent,
    CreateAccountGroupComponent,
    UpdateAccountGroupComponent,
    EditAccountGroupComponent,
    EditAccountComponent,
    AuthDirective,
    NodeTableComponent,
    WorkerStateBadgeComponent,
    VersionChipComponent,
    RunnerTableComponent,
    ListenerStateBadgeComponent,
    LabelStringfiyPipe,
    JsonOptionsTreeComponent,
    ProviderTableComponent,
    ConnectorStateBadgeComponent,
    FilterStringfiyPipe,
    ConfigTableComponent,
    CreateConfigComponent,
    ClusterCardComponent,
    ClusterBreadcrumbComponent,
    NetworkStateComponent,
    ResetAccountPasswordComponent,
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
    NzBadgeModule,
    MomentModule,
    NzToolTipModule,
    NzTreeViewModule,
    NzTreeModule,
    NzIconModule,
    NzProgressModule,
    RouterModule.forChild([]),
    NzDescriptionsModule,
    NzSpaceModule,
  ],
  exports: [
    AccountTableComponent,
    AccountGroupTableComponent,
    CreateAccountGroupComponent,
    EditAccountGroupComponent,
    AuthDirective,
    NodeTableComponent,
    WorkerStateBadgeComponent,
    VersionChipComponent,
    RunnerTableComponent,
    ListenerStateBadgeComponent,
    LabelStringfiyPipe,
    JsonOptionsTreeComponent,
    ProviderTableComponent,
    ConnectorStateBadgeComponent,
    FilterStringfiyPipe,
    ConfigTableComponent,
    CreateConfigComponent,
    ClusterCardComponent,
    ClusterBreadcrumbComponent,
    NetworkStateComponent,
  ]
})
export class SharedModule { }
