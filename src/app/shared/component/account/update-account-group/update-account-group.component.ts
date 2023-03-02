import { Component, ErrorHandler, OnInit } from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {ServerService} from 'src/app/service/server.service';
import {AuthGroup, PermissionResult} from 'src/app/service/server/api';
import {AuthName, UserService, AuthDependence, IAuthGroup, AuthGroupList} from 'src/app/service/user.service';

@Component({
  selector: 'app-update-account-group',
  templateUrl: './update-account-group.component.html',
  styleUrls: ['./update-account-group.component.scss']
})
export class UpdateAccountGroupComponent implements OnInit {
  AuthGroupList = AuthGroupList;

  selectedPermissions: Set<AuthName>;

  group?: AuthGroup;

  constructor(
    private ref: NzModalRef,
    private server: ServerService,
    private user: UserService,
    private errorHandler: ErrorHandler,
    private message: NzMessageService,
  ) {
    console.log(this.group);
    this.selectedPermissions = new Set();
    ref.updateConfig({
      nzTitle: '更新用户组权限',
      nzOnOk: () => {
        if (!this.group)
          return false;
        this.server.auth.updatePermission({
          gid: this.group.id,
          permissions: [...this.selectedPermissions].map((name) => {
            return {
              name,
              permission: PermissionResult.ALLOW,
            };
          }),
        }).subscribe({
          error: (err) => { this.errorHandler.handleError(err); },
          next: () => {
            this.message.success('权限更新成功')
            this.ref.close(true);
          }
        });
        return false;
      }
    })
  }

  ngOnInit() {
    console.log(this.group);
    this.selectedPermissions = new Set(this.group?.permissions.filter((permission) => permission.permission === PermissionResult.ALLOW).map((permission) => permission.name as AuthName));
  }

  hasPermission(name: AuthName) {
    return this.selectedPermissions.has(name);
  }

  changePermission(name: AuthName) {
    if (this.selectedPermissions.has(name)) {
      this.selectedPermissions.delete(name);
      const bindAuth = this.user.getBindAuth(name);
      for (const auth of bindAuth) {
        this.selectedPermissions.delete(auth);
      }
    } else {
      this.selectedPermissions.add(name);
      if (AuthDependence[name]) {
        AuthDependence[name]?.forEach((dep) => {
          this.selectedPermissions.add(dep);
        });
      }
    }
  }

  setPermission(name: AuthName, permission: boolean) {
    if (permission) {
      this.selectedPermissions.add(name);
      if (AuthDependence[name]) {
        AuthDependence[name]?.forEach((dep) => {
          this.selectedPermissions.add(dep);
        });
      }
    } else {
      this.selectedPermissions.delete(name);
      const bindAuth = this.user.getBindAuth(name);
      for (const auth of bindAuth) {
        this.selectedPermissions.delete(auth);
      }
    }
  }

  isSelectedAll(group: IAuthGroup) {
    return group.permissions.every((permission) => this.selectedPermissions.has(permission[0]));
  }

  hasSelectedAny(group: IAuthGroup) {
    return group.permissions.some((permission) => this.selectedPermissions.has(permission[0]));
  }

  toggleSelectAll(group: IAuthGroup) {
    if (this.isSelectedAll(group)) {
      group.permissions.forEach(permission => this.setPermission(permission[0], false));
    } else {
      group.permissions.forEach(permission => this.setPermission(permission[0], true));
    }
  }
}
