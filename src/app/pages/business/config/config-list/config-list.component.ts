import { Component, ViewChild } from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ConfigTableComponent} from 'src/app/shared/component/config/config-table/config-table.component';
import {CreateConfigComponent} from 'src/app/shared/component/config/create-config/create-config.component';

@Component({
  selector: 'app-config-list',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.scss']
})
export class ConfigListComponent {
  @ViewChild(ConfigTableComponent)
  table: ConfigTableComponent | null = null;

  constructor(
    private modal: NzModalService,
  ) { }

  createConfigFile() {
    this.modal.create({
      nzContent: CreateConfigComponent,
      nzTitle: '创建配置'
    }).afterClose.subscribe({
      next: (result) => {
        if (result && this.table) {
          this.table.updateData();
        }
      }
    });
  }

  updateData() {
    this.table?.updateData();
  }
}
