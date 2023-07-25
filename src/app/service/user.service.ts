import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {UserError} from './error/UserError';
import {ServerService} from './server/server.service';
import {PermissionResult, UserErrorCode} from './server/api';
import {TokenService} from './server/token.service';

export interface IUserInfo {
  id: number;
  nickname?: string;
  avatarUrl?: string;
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
  API_Account_Reset_Password = 'auth/resetPassword',
}

export const AuthDependence: {
  [key in AuthName]?: AuthName[]
} = {
  [AuthName.UI_Account_List]: [AuthName.API_Account_Fetch, AuthName.UI_Account],
  [AuthName.UI_Account_AuthGroup]: [AuthName.API_AuthGroup_Fetch, AuthName.UI_Account],
  [AuthName.API_Account_Update]: [AuthName.API_AuthGroup_Fetch],
  [AuthName.API_Account_Create]: [AuthName.API_AuthGroup_Fetch],
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
      [AuthName.API_AuthGroup_Delete, '删除用户组'],
      [AuthName.API_Account_Reset_Password, '重设用户密码'],
    ]
  },
  {
    group: '仪表盘',
    permissions: [
      [AuthName.UI_Dashboard, '仪表盘页面']
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

  get accountId() {
    return this.userInfo?.id;
  }

  login(info: IUserInfo, permissions: {name: string, permission: PermissionResult}[], token: string, expireAt: number) {
    this.userInfo = info;
    for (const permission of permissions) {
      this.permissions.set(permission.name as AuthName, permission.permission);
    }
    this.loadPermission(permissions);
    this.token.setToken(token, expireAt);
  }

  loadPermission(permissions: {name: string, permission: PermissionResult}[]) {
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
