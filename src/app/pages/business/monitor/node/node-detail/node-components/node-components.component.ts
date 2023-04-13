import { Component, OnDestroy } from '@angular/core';
import {ClusterNode} from 'src/app/service/cluster/cluster-node';
import {NodeDetailDataService} from '../node-detail-data.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-node-components',
  templateUrl: './node-components.component.html',
  styleUrls: ['./node-components.component.scss']
})
export class NodeComponentsComponent implements OnDestroy {
  node: ClusterNode | null;
  private nodeSubscription_: Subscription;

  constructor(
    private nodeDetail: NodeDetailDataService,
  ) {
    this.nodeSubscription_ = this.nodeDetail.$nodeDetail.subscribe((node) => {
      this.node = node;
      console.log(this.node);
    });
  }

  get components() {
    return this.node?.run?.components || [];
  }

  ngOnDestroy(): void {
    if (this.nodeSubscription_)
      this.nodeSubscription_.unsubscribe();
  }
}
