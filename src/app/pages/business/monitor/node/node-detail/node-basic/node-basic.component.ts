import { Component, Host, Input, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ClusterNode} from 'src/app/service/cluster/cluster-node';
import {WorkerState} from 'src/app/service/server/api';
import {TimeService} from 'src/app/service/time.service';
import {NodeDetailDataService} from '../node-detail-data.service';
import {NodeDetailComponent} from '../node-detail.component';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-node-basic',
  templateUrl: './node-basic.component.html',
  styleUrls: ['./node-basic.component.scss']
})
export class NodeBasicComponent implements OnInit, OnDestroy {
  node: ClusterNode | null;
  WorkerState = WorkerState;
  private nodeSubscription_: Subscription;

  constructor(
    private nodeDetail: NodeDetailDataService,
    public time: TimeService,
  ) {
    this.nodeSubscription_ = this.nodeDetail.$nodeDetail.subscribe((node) => {
      this.node = node;
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    if (this.nodeSubscription_)
      this.nodeSubscription_.unsubscribe();
  }
}
