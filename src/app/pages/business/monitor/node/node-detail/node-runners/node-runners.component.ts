import { Component, OnDestroy } from '@angular/core';
import {ClusterNode} from 'src/app/service/cluster/cluster-node';
import {NodeDetailDataService} from '../node-detail-data.service';
import {Observable, Subscription} from 'rxjs';
import {ClusterRunner} from 'src/app/service/cluster/cluster-runner';
import {ClusterService} from 'src/app/service/cluster/cluster.service';

@Component({
  selector: 'app-node-runners',
  templateUrl: './node-runners.component.html',
  styleUrls: ['./node-runners.component.scss']
})
export class NodeRunnersComponent implements OnDestroy {
  node: ClusterNode | null;
  private nodeSubscription_: Subscription;
  $list: Observable<ClusterRunner[]>;

  constructor(
    private nodeDetail: NodeDetailDataService,
    private cluster: ClusterService,
  ) {
    this.nodeDetail.$nodeDetail.subscribe((node) => {
      this.node = node;
      if (this.node) {
        this.$list = this.cluster.observeRunnersByNodeId(this.node.id);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.nodeSubscription_)
      this.nodeSubscription_.unsubscribe();
  }
}
