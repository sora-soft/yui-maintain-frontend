import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, filter, map} from 'rxjs';
import {ClusterNode} from 'src/app/service/cluster/cluster-node';
import {ClusterService} from 'src/app/service/cluster/cluster.service';

@Component({
  selector: 'app-cluster-nodes',
  templateUrl: './cluster-nodes.component.html',
  styleUrls: ['./cluster-nodes.component.scss']
})
export class ClusterNodesComponent {
  $nodes: Observable<ClusterNode[]>;

  constructor(
    cluster: ClusterService,
    private route: ActivatedRoute,
  ) {
    this.route.parent?.paramMap.subscribe({
      next: (data) => {
        this.$nodes = cluster.$node.pipe(
          map((list) => list.filter(node => node.scope == data.get('name')))
        )
      }
    })
  }
}
