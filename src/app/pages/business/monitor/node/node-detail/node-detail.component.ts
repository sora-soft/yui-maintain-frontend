import {Location} from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {Subscription, expand, filter, from, map, of} from 'rxjs';
import {ClusterNode} from 'src/app/service/cluster/cluster-node';
import {ClusterService} from 'src/app/service/cluster/cluster.service';
import {IRouteHistory, RouterHistoryService} from 'src/app/service/router-history.service';
import {NodeDetailDataService} from './node-detail-data.service';

@Component({
  selector: 'app-node-detail',
  templateUrl: './node-detail.component.html',
  styleUrls: ['./node-detail.component.scss', '../../common/detail-style.scss']
})
export class NodeDetailComponent implements OnInit, OnDestroy {
  node: ClusterNode | null;
  private preRoute: IRouteHistory | undefined;
  private nodeSubscription_: Subscription;
  private routeSubscription_: Subscription;

  constructor(
    private cluster: ClusterService,
    private route: ActivatedRoute,
    private nodeDetailService: NodeDetailDataService,
    private routeHistory: RouterHistoryService,
  ) {
    this.routeSubscription_ = this.route.paramMap.subscribe({
      next: (paramMap) => {
        const id = paramMap.get('id');
        if (this.nodeSubscription_)
          this.nodeSubscription_.unsubscribe();
        this.nodeSubscription_ = this.cluster.$node.pipe(
          filter(_ => this.cluster.ready),
          map(list => list.find(node => node.meta.id === id))
        ).subscribe((node) => {
          if (!node) {
            this.goBack();
            return;
          }
          this.node = node;
          this.nodeDetailService.$nodeDetail.next(node);
        });
      }
    });
  }

  ngOnInit(): void {
    this.preRoute = this.routeHistory.getPrevious('/business/monitor/node-detail');
    console.log('preRoute', this.preRoute);
  }

  ngOnDestroy(): void {
    if (this.nodeSubscription_)
      this.nodeSubscription_.unsubscribe();
    if (this.routeSubscription_)
      this.routeSubscription_.unsubscribe();
  }

  goBack() {
    this.routeHistory.back(this.preRoute, '/business/monitor/node-list');
  }
}
