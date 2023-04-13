import { Component } from '@angular/core';
import {Observable, map} from 'rxjs';
import {ClusterNode} from 'src/app/service/cluster/cluster-node';
import {ClusterRunner, ClusterRunnerType} from 'src/app/service/cluster/cluster-runner';
import {ClusterService} from 'src/app/service/cluster/cluster.service';
import {WorkerState} from 'src/app/service/server/api';

interface IClusterData {
  scope: string;
  $workers: Observable<ClusterRunner[]>;
  $services: Observable<ClusterRunner[]>;
  $nodes: Observable<ClusterNode[]>;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  WorkerState = WorkerState;

  $runningNode: Observable<ClusterNode[]>;
  $clusterList: Observable<IClusterData[]>;

  constructor(
    public cluster: ClusterService,
  ) {
    this.$runningNode = this.cluster.$node.pipe(
      map(list => list.filter(node => node.meta.state === WorkerState.READY)),
    );

    this.$clusterList = this.cluster.$cluster.pipe(
      map(list => list.map((scope) => {
        return {
          scope: scope,
          $workers: this.cluster.$runner.pipe(
            map(list => list.filter(runner => runner.type === ClusterRunnerType.Worker)),
            map(list => list.filter(runner => runner.scope === scope)),
          ),
          $services: this.cluster.$runner.pipe(
            map(list => list.filter(runner => runner.type === ClusterRunnerType.Service)),
            map(list => list.filter(runner => runner.scope === scope)),
          ),
          $nodes: this.cluster.$node.pipe(
            map(list => list.filter(node => node.scope === scope)),
          )
        };
      }))
    )
  }
}
