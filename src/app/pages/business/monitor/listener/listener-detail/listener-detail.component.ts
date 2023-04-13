import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription, filter, map} from 'rxjs';
import {ClusterListener} from 'src/app/service/cluster/cluster-listener';
import {ClusterNode} from 'src/app/service/cluster/cluster-node';
import {ClusterRunner} from 'src/app/service/cluster/cluster-runner';
import {ClusterService} from 'src/app/service/cluster/cluster.service';
import {IRouteHistory, RouterHistoryService} from 'src/app/service/router-history.service';

@Component({
  selector: 'app-listener-detail',
  templateUrl: './listener-detail.component.html',
  styleUrls: ['./listener-detail.component.scss', '../../common/detail-style.scss']
})
export class ListenerDetailComponent implements OnInit, OnDestroy {
  listener?: ClusterListener;
  private preRoute: IRouteHistory | undefined;
  private listenerSubscription_: Subscription;
  private routeSubscription_: Subscription;

  constructor(
    private cluster: ClusterService,
    private route: ActivatedRoute,
    private routeHistory: RouterHistoryService,
  ) {
    this.routeSubscription_ = this.route.paramMap.subscribe({
      next: (paramMap) => {
        const id = paramMap.get('id');
        if (this.listenerSubscription_)
          this.listenerSubscription_.unsubscribe();
        this.listenerSubscription_ = this.cluster.$listener.pipe(
          filter(_ => this.cluster.ready),
          map(list => list.find(listener => listener.meta.id === id))
        ).subscribe((listener) => {
          if (!listener) {
            this.goBack();
            return;
          }
          this.listener = listener;
        });
      }
    });
  }

  ngOnInit(): void {
    this.preRoute = this.routeHistory.getPrevious('/business/monitor/listener-detail');
  }

  ngOnDestroy(): void {
    if (this.listenerSubscription_)
      this.listenerSubscription_.unsubscribe();
    if (this.routeSubscription_)
      this.routeSubscription_.unsubscribe();
  }

  goBack() {
    this.routeHistory.back(this.preRoute, `/business/monitor/runner-detail/${this.listener?.service?.id}`);
  }
}
