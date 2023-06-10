import { Component, ErrorHandler } from '@angular/core';
import {ServerDataTable} from 'src/app/shared/lib/server-data-table';
import {ConfigFile} from 'src/app/service/server/api';
import {ServerService} from 'src/app/service/server/server.service';
import {NzModalService} from 'ng-zorro-antd/modal';
import {AuthName} from '../../../../service/user.service';

@Component({
  selector: 'app-config-table',
  templateUrl: './config-table.component.html',
  styleUrls: ['./config-table.component.scss']
})
export class ConfigTableComponent extends ServerDataTable<ConfigFile> {
  AuthName = AuthName;

  constructor(
    private server: ServerService,
    private errorHandler: ErrorHandler,
  ) {
    super('config-file', server, errorHandler, {}, []);
  }

  deleteConfigFile(data: ConfigFile) {
    this.server.restful.delete({
      db: 'config-file',
      where: {
        name: data.name,
      }
    }).subscribe({
      next: () => {
        this.updateData();
      },
      error: (err) => {
        this.errorHandler.handleError(err);
      }
    });
  }
}
