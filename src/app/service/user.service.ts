import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {UserError} from './error/UserError';
import {ServerService} from './server/server.service';
import {AuthPermission, PermissionResult, UserErrorCode} from './server/api';
import {TokenService} from './server/token.service';

export interface IUserInfo {
  id: number;
  username: string;
  email: string;
  nickname: string;
}

export interface IAuthGroup {
  group: string;
  permissions: [AuthName, string][];
}


export enum AuthName {
  Root = 'root',

  UI_Dashboard = 'ui.dashboard',
  UI_Account = 'ui.account',
  UI_Account_AuthGroup = 'ui.account.auth-group',
  API_AuthGroup_Fetch = 'restful/fetch/auth-group',
  API_AuthGroup_Insert = 'restful/insert/auth-group',
  API_AuthGroup_Update = 'restful/update/auth-group',
  API_AuthGroup_Permission = 'auth/updatePermission',
  API_AuthGroup_Delete = 'auth/deleteAuthGroup',
  UI_Account_List = 'ui.account.account-list',
  API_Account_Fetch = 'restful/fetch/account',
  API_Account_Create = 'auth/createAccount',
  API_Account_Update = 'restful/update/account',
  API_Account_Disable = 'auth/disableAccount',
  UI_Config = 'ui.config',
  API_Config_Fetch = 'restful/fetch/config-file',
  API_Config_Create = 'restful/insert/config-file',
  API_Config_Update = 'restful/update/config-file',
  API_Config_Delete = 'restful/delete/config-file',

  UI_Cluster = 'ui.cluster',
  API_Monitor_Fetch = 'monitor/cluster',
}

export const AuthDependence: {
  [key in AuthName]?: AuthName[]
} = {
  [AuthName.UI_Account_List]: [AuthName.API_Account_Fetch, AuthName.UI_Account],
  [AuthName.UI_Account_AuthGroup]: [AuthName.API_AuthGroup_Fetch, AuthName.UI_Account],
  [AuthName.API_Account_Update]: [AuthName.API_AuthGroup_Fetch],
  [AuthName.API_Account_Create]: [AuthName.API_AuthGroup_Fetch],
  [AuthName.UI_Cluster]: [AuthName.API_Monitor_Fetch],
  [AuthName.UI_Dashboard]: [AuthName.API_Monitor_Fetch],
  [AuthName.UI_Config]: [AuthName.API_Config_Fetch],
};

export const AuthGroupList: IAuthGroup[] = [
  {
    group: '用户管理',
    permissions: [
      [AuthName.UI_Account, '用户管理'],
      [AuthName.UI_Account_List, '用户管理页面'],
      [AuthName.API_Account_Fetch, '获取用户列表'],
      [AuthName.API_Account_Create, '新建用户'],
      [AuthName.API_Account_Update, '更新用户信息'],
      [AuthName.API_Account_Disable, '封禁用户'],
      [AuthName.UI_Account_AuthGroup, '用户组管理页面'],
      [AuthName.API_AuthGroup_Fetch, '获取用户组列表'],
      [AuthName.API_AuthGroup_Insert, '新建用户组'],
      [AuthName.API_AuthGroup_Update, '更新用户组'],
      [AuthName.API_AuthGroup_Permission, '修改用户组权限'],
      [AuthName.API_AuthGroup_Delete, '删除用户组']
    ]
  },
  {
    group: '仪表盘',
    permissions: [
      [AuthName.UI_Dashboard, '仪表盘页面']
    ]
  },
  {
    group: '集群监控',
    permissions: [
      [AuthName.UI_Cluster, '集群监控页面'],
      [AuthName.API_Monitor_Fetch, '获取集群信息'],
    ]
  },
  {
    group: '配置文件',
    permissions: [
      [AuthName.UI_Config, '配置文件管理页面'],
      [AuthName.API_Config_Fetch, '获取配置文件'],
      [AuthName.API_Config_Create, '创建配置文件'],
      [AuthName.API_Config_Update, '更新配置文件'],
      [AuthName.API_Config_Delete, '删除配置文件'],
    ]
  }
];

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userInfo: IUserInfo | null = null;
  private permissions = new Map<AuthName, PermissionResult>();

  constructor(
    private server: ServerService,
    private router: Router,
    private token: TokenService,
  ) {}

  get nickname() {
    return this.userInfo?.nickname;
  }

  login(info: IUserInfo, permissions: AuthPermission[], token: string, expireAt: number) {
    this.userInfo = info;
    for (const permission of permissions) {
      this.permissions.set(permission.name as AuthName, permission.permission);
    }
    this.loadPermission(permissions);
    this.token.setToken(token, expireAt);
  }

  loadPermission(permissions: AuthPermission[]) {
    this.permissions.clear();
    permissions.forEach((permission) => {
      this.permissions.set(permission.name as AuthName, permission.permission);
    });
  }

  logout() {
    this.clearPermission();
  }

  checkPermissions(names: AuthName | AuthName[]) {
    if (!Array.isArray(names)) {
      names = [names]
    }

    return names.some((name) => this.permissions.get(name) === PermissionResult.ALLOW) || this.permissions.get(AuthName.Root) === PermissionResult.ALLOW;
  }

  clearPermission() {
    this.permissions.clear();
  }

  getBindAuth(name: AuthName) {
    const result = new Set<AuthName>();
    for (const [auth, dependence] of Object.entries(AuthDependence)) {
      if (dependence.includes(name)) {
        result.add(auth as AuthName);
      }
    }
    return [...result];
  }

  fetchUserInfo() {
    return this.server.gateway.info().subscribe({
      next: (result) => {
        this.userInfo = result.account;
        this.loadPermission(result.permissions);
      },
      error: (err) => {
        if (err instanceof UserError) {
          if (err.code === UserErrorCode.ERR_NOT_LOGIN) {
            this.router.navigate(['/auth/login']);
          }
        }
      }
    });
  }
}
