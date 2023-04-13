import { Component, Input, OnDestroy } from '@angular/core';
import {ClusterService} from 'src/app/service/cluster/cluster.service';
import {TimeService} from 'src/app/service/time.service';
import {ClusterNode} from 'src/app/service/cluster/cluster-node';
import {INodeMetaData, INodeRunData, WorkerState} from 'src/app/service/server/api';
import {ObservableDataTable} from '../../../lib/observable-data-table';
import {BehaviorSubject, interval, map, Observable, Subject} from 'rxjs';
import {NzTableFilterFn, NzTableFilterList} from 'ng-zorro-antd/table';

@Component({
  selector: 'app-node-table',
  templateUrl: './node-table.component.html',
  styleUrls: ['./node-table.component.scss', '../../../style/common-table.scss']
})
export class NodeTableComponent {
  $now: BehaviorSubject<number>;
  WorkerState = WorkerState;
  expandSet = new Set<string>();

  loading = false;
  pageIndex = 1;
  pageSize = 10;
  list_: ClusterNode[] = [];

  @Input()
  set list(value: ClusterNode[]) {
    this.list_ = value;
    const clusterSet = new Set<string>();
    const hostSet = new Set<string>();
    for (const node of value) {
      clusterSet.add(node.scope);
      hostSet.add(node.meta.host);
    }
    this.filters['cluster'].list = [...clusterSet].map((name) => ({text: name, value: name, byDefault: this.filters['cluster'].selected.includes(name)}));
    this.filters['host'].list = [...hostSet].map((host) => ({text: host, value: host, byDefault: this.filters['host'].selected.includes(host)}));
  }

  get list() {
    return this.list_;
  }

  filters = {
    state: {
      list: [{
        text: '初始化',
        value: WorkerState.INIT,
      }, {
        text: '启动中',
        value: WorkerState.PENDING,
      }, {
        text: '运行中',
        value: WorkerState.READY,
      }, {
        text: '停止中',
        value: WorkerState.STOPPING,
      }, {
        text: '已停止',
        value: WorkerState.STOPPED,
      }, {
        text: '错误',
        value: WorkerState.ERROR,
      }],
      fn: (list: WorkerState[], node: ClusterNode) => {
        if (!list.length)
          return true;
        return list.includes(node.meta.state);
      },
      selected: [],
    },
    cluster: {
      list: [],
      fn: (list: unknown[], node: ClusterNode) => {
        if (!list.length)
          return true;
        return list.includes(node.scope);
      },
      selected: [],
    },
    host: {
      list: [],
      fn: (list: unknown[], node: ClusterNode) => {
        if (!list.length)
          return true;
        return list.includes(node.meta.host);
      },
      selected: [],
    }
  } as {
    [k: string]: {
      list: NzTableFilterList;
      fn: NzTableFilterFn;
      selected: unknown[];
    }
  };

  constructor(
    time: TimeService,
  ) {
    this.$now = time.$unixNow;
  }

  addFilter(prop: string, value?: unknown) {
    if (this.filters[prop]) {
      this.filters[prop].list = this.filters[prop].list.map((filter) => {
        if (value && filter.value === value) {
          filter.byDefault = true;
        } else {
          filter.byDefault = false;
        }
        return filter;
      });
      this.filters[prop].selected.push(value);
    }
  }

  runTimeSortFn(a: ClusterNode, b: ClusterNode) {
    return b.meta.startTime - a.meta.startTime;
  }

  onFilterChange(key: string, event: unknown[]) {
    this.filters[key].selected = event;
  }

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

}
