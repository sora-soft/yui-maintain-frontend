import { inject, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import {AccountComponent} from './account/account.component';
import {BusinessComponent} from './business.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AccountListComponent} from './account/account-list/account-list.component';
import {GroupListComponent} from './account/group-list/group-list.component'
import {ServerService} from 'src/app/service/server.service';
import {UserService} from 'src/app/service/user.service';
import {BusinessCanActivate} from './business-can-activate';

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
