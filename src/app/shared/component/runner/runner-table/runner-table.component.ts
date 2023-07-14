import { Component, Input } from '@angular/core';
import {WorkerState} from 'src/app/service/server/api';
import {TimeService} from 'src/app/service/time.service';
import {ClusterRunner} from '../../../../service/cluster/cluster-runner';
import {NzTableFilterFn, NzTableFilterList} from 'ng-zorro-antd/table';

@Component({
  selector: 'app-runner-table',
  templateUrl: './runner-table.component.html',
  styleUrls: ['./runner-table.component.scss', '../../../style/common-table.scss']
})
export class RunnerTableComponent {
  WorkerState = WorkerState;

  loading = false;
  pageIndex = 1;
  pageSize = 10;

  list_: ClusterRunner[] = [];

  @Input()
  set list(value: ClusterRunner[]) {
    this.list_ = value;

    const clusterSet = new Set<string>();
    const nameSet = new Set<string>();
    for (const node of value) {
      clusterSet.add(node.scope);
      nameSet.add(`${node.name}@${node.type}@${node.scope}`);
    }
    this.filters['cluster'].list = [...clusterSet].map((name) => ({text: name, value: name, byDefault: this.filters['cluster'].selected.includes(name)}));
    this.filters['name'].list = [...nameSet].map((name) => ({text: name.split('@')[0], value: name, byDefault: this.filters['name'].selected.includes(name)}));
  }

  get list() {
    return this.list_;
  }
  @Input()
  hiddenColumns: string[] = [];

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
      fn: (list: WorkerState[], node: ClusterRunner) => {
        if (!list.length)
          return true;
        return list.includes(node.data.state);
      },
      selected: [] as WorkerState[],
    },
    cluster: {
      list: [],
      fn: (list: string[], node: ClusterRunner) => {
        if (!list.length)
          return true;
        return list.includes(node.scope);
      },
      selected: [] as string[],
    },
    name: {
      list: [],
      fn: (list: string[], node: ClusterRunner) => {
        if (!list.length)
          return true;
        //runner.name + '@' + runner.type + '@' + runner.scope
        return list.includes(`${node.name}@${node.type}@${node.scope}`);
      },
      selected: [] as string[],
    }
  } as {
    [k: string]: {
      list: NzTableFilterList;
      fn: NzTableFilterFn;
      selected: unknown[],
    }
  };

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

  runTimeSortFn(a: ClusterRunner, b: ClusterRunner) {
    return b.data.startTime - a.data.startTime;
  }

  onFilterChange(key: string, event: unknown[]) {
    this.filters[key].selected = event;
  }

  constructor(
    public time: TimeService,
  ) {}
}
