import { Component, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd/modal';
import {AuthName} from 'src/app/service/user.service';
import {ConfigTableComponent} from 'src/app/shared/component/config/config-table/config-table.component';
import {CreateConfigComponent} from 'src/app/shared/component/config/create-config/create-config.component';

@Component({
  selector: 'app-config-list',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.scss']
})
export class ConfigListComponent {
  AuthName = AuthName;

  @ViewChild(ConfigTableComponent)
  table: ConfigTableComponent | null = null;

  constructor(
    private modal: NzModalService,
    private router: Router,
  ) { }

  createConfigFile() {
    this.modal.create({
      nzContent: CreateConfigComponent,
      nzTitle: '创建配置'
    }).afterClose.subscribe({
      next: (result) => {
        if (result && this.table) {
          this.router.navigate(['/business/config/edit', result.name])
        }
      }
    });
  }

  updateData() {
    this.table?.updateData();
  }
}
