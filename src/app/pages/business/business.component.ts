import { Component, OnDestroy, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ClusterService} from 'src/app/service/cluster/cluster.service';
import {ServerService} from 'src/app/service/server/server.service';
import {AuthName, UserService} from 'src/app/service/user.service';
import {RouterHistoryService} from 'src/app/service/router-history.service';


@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss']
})
export class BusinessComponent implements OnInit, OnDestroy {
  constructor(
    private user: UserService,
    private server: ServerService,
    private router: Router,
    private cluster: ClusterService,
    private routerHistory: RouterHistoryService,
  ) {
    this.routerHistory.start();
  }

  ngOnInit(): void {
    this.cluster.startup();
  }

  ngOnDestroy(): void {
    this.cluster.shutdown();
  }

  get nickname() {
    return this.user.nickname;
  }

  navList = [{
    icon: 'dashboard',
    name: '仪表盘',
    link: '/business/dashboard',
  }, {
    icon: 'monitor',
    name: '集群监控',
    link: '/business/monitor',
    children: [{
      name: '节点',
      link: '/business/monitor/node-list',
      auth: [AuthName.UI_Cluster],
    }, {
      name: '服务',
      link: '/business/monitor/runner-list',
      auth: [AuthName.UI_Cluster],
    }]
  }, {
    icon: 'file-text',
    name: '配置文件',
    link: '/business/config'
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
    this.server.gateway.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: () => {}
    })
  }
}
