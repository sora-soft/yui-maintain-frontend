import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ClusterService} from 'src/app/service/cluster/cluster.service';
import {IRouteHistory, RouterHistoryService} from 'src/app/service/router-history.service';

@Component({
  selector: 'app-cluster-detail',
  templateUrl: './cluster-detail.component.html',
  styleUrls: ['./cluster-detail.component.scss']
})
export class ClusterDetailComponent {
  private routeSubscription_: Subscription;
  private preRoute: IRouteHistory | undefined;

  name: string;

  constructor(
    private cluster: ClusterService,
    private route: ActivatedRoute,
    private routeHistory: RouterHistoryService,
  ) {
    this.routeSubscription_ = this.route.paramMap.subscribe({
      next: (paramMap) => {
        const name = paramMap.get('name');
        if (name)
          this.name = name;
      }
    });
  }

  ngOnInit(): void {
    this.preRoute = this.routeHistory.getPrevious('/business/monitor/cluster-detail');
  }

  ngOnDestroy(): void {
    if (this.routeSubscription_)
      this.routeSubscription_.unsubscribe();
  }

  goBack() {
    this.routeHistory.back(this.preRoute, '/business/monitor/cluster-list');
  }
}
