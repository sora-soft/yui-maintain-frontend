import { Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription, filter, map} from 'rxjs';
import {ClusterListener} from 'src/app/service/cluster/cluster-listener';
import {ClusterNode} from 'src/app/service/cluster/cluster-node';
import {ClusterRunner} from 'src/app/service/cluster/cluster-runner';
import {ClusterService} from 'src/app/service/cluster/cluster.service';
import {IRouteHistory, RouterHistoryService} from 'src/app/service/router-history.service';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss', '../../common/detail-style.scss']
})
export class ServiceDetailComponent implements OnInit, OnDestroy {
  runner: ClusterRunner | null;
  $listeners: Observable<ClusterListener[]>;
  private preRoute: IRouteHistory | undefined;
  private runnerSubscription_: Subscription;
  private routeSubscription_: Subscription;

  constructor(
    private cluster: ClusterService,
    private route: ActivatedRoute,
    private routeHistory: RouterHistoryService,
  ) {
    this.$listeners = cluster.$listener.pipe(map(list => list.filter(listener => listener.meta.targetId === this.runner?.id)));
    this.routeSubscription_ = this.route.paramMap.subscribe({
      next: (paramMap) => {
        const id = paramMap.get('id');
        this.runnerSubscription_ = this.cluster.$runner.pipe(
          filter(_ => this.cluster.ready),
          map(list => list.find(runner => runner.id === id))
        ).subscribe((runner) => {
          if (!runner) {
            this.goBack();
            return;
          }
          this.runner = runner;
        });
      }
    });
  }

  ngOnInit(): void {
    this.preRoute = this.routeHistory.getPrevious('/business/monitor/runner-detail');
  }

  ngOnDestroy(): void {
    if (this.runnerSubscription_)
      this.runnerSubscription_.unsubscribe();
    if (this.routeSubscription_)
      this.routeSubscription_.unsubscribe();
  }

  goBack() {
    this.routeHistory.back(this.preRoute, '/business/monitor/runner-list');
  }
}
