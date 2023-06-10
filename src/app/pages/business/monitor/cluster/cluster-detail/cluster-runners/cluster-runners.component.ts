import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, map} from 'rxjs';
import {ClusterNode} from 'src/app/service/cluster/cluster-node';
import {ClusterRunner} from 'src/app/service/cluster/cluster-runner';
import {ClusterService} from 'src/app/service/cluster/cluster.service';

@Component({
  selector: 'app-cluster-runners',
  templateUrl: './cluster-runners.component.html',
  styleUrls: ['./cluster-runners.component.scss']
})
export class ClusterRunnersComponent {
  $runners: Observable<ClusterRunner[]>;

  constructor(
    cluster: ClusterService,
    private route: ActivatedRoute,
  ) {
    this.route.parent?.paramMap.subscribe({
      next: (data) => {
        this.$runners = cluster.$runner.pipe(
          map((list) => list.filter(runner => runner.scope == data.get('name')))
        )
      }
    })
  }
}
