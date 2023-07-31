import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {ServerService} from 'src/app/service/server/server.service';
import {AuthName, UserService} from 'src/app/service/user.service';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent {
  constructor(
    private user: UserService,
    private server: ServerService,
    private router: Router,
  ) {}

  get nickname() {
    return this.user.nickname;
  }

  navList = [{
    icon: 'dashboard',
    name: '仪表盘',
    link: '/business/dashboard',
  }, {
    icon: 'user',
    name: '用户管理',
    auth: [AuthName.UI_Account],
    children: [{
      name: '账号列表',
      link: '/business/account/account-list',
      auth: [AuthName.UI_Account_List]
    }, {
      name: '用户组',
      link: '/business/account/group-list',
      auth: [AuthName.UI_Account_AuthGroup]
    }]
  }]

  logout() {
    this.server.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: () => {}
    })
  }
}
