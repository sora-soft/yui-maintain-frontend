import { Component, Input } from '@angular/core';
import {ClusterService} from 'src/app/service/cluster/cluster.service';
import {ConnectorState, IProviderMetaData} from 'src/app/service/server/api';

@Component({
  selector: 'app-provider-table',
  templateUrl: './provider-table.component.html',
  styleUrls: ['./provider-table.component.scss',  '../../../style/common-table.scss']
})
export class ProviderTableComponent {
  expandSet = new Set<string>();
  ConnectorState = ConnectorState;

  loading = false;
  pageIndex = 1;
  pageSize = 10;

  @Input()
  list: IProviderMetaData[] = [];

  constructor(
    private cluster: ClusterService
  ) {}

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  getRunner(id: string) {
    return this.cluster.getRunner(id);
  }
}
