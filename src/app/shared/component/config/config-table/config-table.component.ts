import { Component, ErrorHandler } from '@angular/core';
import {ServerDataTable} from 'src/app/shared/lib/server-data-table';
import {ConfigFile} from 'src/app/service/server/api';
import {ServerService} from 'src/app/service/server/server.service';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-config-table',
  templateUrl: './config-table.component.html',
  styleUrls: ['./config-table.component.scss']
})
export class ConfigTableComponent extends ServerDataTable<ConfigFile> {
  constructor(
    private server: ServerService,
    private modal: NzModalService,
    private errorHandler: ErrorHandler,
  ) {
    super('config-file', server, errorHandler, {}, []);
  }
}
