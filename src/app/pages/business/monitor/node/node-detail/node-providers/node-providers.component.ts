import { Component, OnDestroy } from '@angular/core';
import {NodeDetailDataService} from '../node-detail-data.service';
import {Subscription} from 'rxjs';
import {ClusterNode} from 'src/app/service/cluster/cluster-node';

@Component({
  selector: 'app-node-providers',
  templateUrl: './node-providers.component.html',
  styleUrls: ['./node-providers.component.scss']
})
export class NodeProvidersComponent implements OnDestroy {
  private nodeSubscription_: Subscription;
  node: ClusterNode | null;

  constructor(
    private nodeDetail: NodeDetailDataService,
  ) {
    this.nodeSubscription_ = this.nodeDetail.$nodeDetail.subscribe((node) => {
      this.node = node;
      console.log(this.node?.providers);
    });
  }

  ngOnDestroy(): void {
    if (this.nodeSubscription_)
      this.nodeSubscription_.unsubscribe();
  }
}
