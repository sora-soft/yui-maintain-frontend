import { Component } from '@angular/core';
import {Observable, map} from 'rxjs';
import {ClusterRunnerType} from 'src/app/service/cluster/cluster-runner';
import {ClusterService} from 'src/app/service/cluster/cluster.service';
import {IClusterData} from 'src/app/shared/component/cluster/cluster-card/cluster-card.component';

@Component({
  selector: 'app-cluster-list',
  templateUrl: './cluster-list.component.html',
  styleUrls: ['./cluster-list.component.scss']
})
export class ClusterListComponent {
  $clusterList: Observable<IClusterData[]>;

  constructor(
    public cluster: ClusterService,
  ) {

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
