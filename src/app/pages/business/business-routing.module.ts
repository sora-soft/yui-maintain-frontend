import { inject, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import {AccountComponent} from './account/account.component';
import {BusinessComponent} from './business.component';
import {MonitorComponent} from './monitor/monitor.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AccountListComponent} from './account/account-list/account-list.component';
import {GroupListComponent} from './account/group-list/group-list.component'
import {UserService} from 'src/app/service/user.service';
import {BusinessCanActivate} from './business-can-activate';
import {NodeListComponent} from './monitor/node/node-list/node-list.component';
import {NodeDetailComponent} from './monitor/node/node-detail/node-detail.component';
import { NodeBasicComponent } from './monitor/node/node-detail/node-basic/node-basic.component';
import { NodeRunnersComponent } from './monitor/node/node-detail/node-runners/node-runners.component';
import { ServiceListComponent } from './monitor/service/service-list/service-list.component';
import { ServiceDetailComponent } from './monitor/service/service-detail/service-detail.component';
import {ListenerDetailComponent} from './monitor/listener/listener-detail/listener-detail.component';
import { NodeComponentsComponent } from './monitor/node/node-detail/node-components/node-components.component';
import { NodeProvidersComponent } from './monitor/node/node-detail/node-providers/node-providers.component';
import { ConfigComponent } from './config/config.component';
import { ConfigListComponent } from './config/config-list/config-list.component';
import { EditConfigComponent } from './config/edit-config/edit-config.component';
import {ConfigDataResolveService} from './config/config-data-resolve.service';

export const userResolver: ResolveFn<unknown> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      console.log('resolve')
      return inject(UserService).fetchUserInfo()
    };

const routes: Routes = [
  {
    path: '',
    component: BusinessComponent,
    canActivate: [BusinessCanActivate],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'account',
        component: AccountComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'account-list'
          },
          {
            path: 'account-list',
            component: AccountListComponent
          },
          {
            path: 'group-list',
            component: GroupListComponent,
          }
        ]
      },
      {
        path: 'monitor',
        component: MonitorComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'node-list'
          },
          {
            path: 'node-list',
            component: NodeListComponent,
          },
          {
            path: 'node-detail/:id',
            component: NodeDetailComponent,
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'basic',
              },
              {
                path: 'basic',
                component: NodeBasicComponent
              },
              {
                path: 'runners',
                component: NodeRunnersComponent
              },
              {
                path: 'components',
                component: NodeComponentsComponent
              },
              {
                path: 'providers',
                component: NodeProvidersComponent,
              }
            ]
          },
          {
            path: 'runner-list',
            component: ServiceListComponent
          },
          {
            path: 'runner-detail/:id',
            component: ServiceDetailComponent,
          },
          {
            path: 'listener-detail/:id',
            component: ListenerDetailComponent,
          }
        ]
      },
      {
        path: 'config',
        component: ConfigComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'config-list',
          },
          {
            path: 'config-list',
            component: ConfigListComponent,
          },
          {
            path: 'edit/:name',
            component: EditConfigComponent,
            resolve: {
              file: ConfigDataResolveService
            }
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
