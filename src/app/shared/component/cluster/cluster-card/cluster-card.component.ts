import { Component, Input } from '@angular/core';
import {Observable} from 'rxjs';
import {ClusterNode} from 'src/app/service/cluster/cluster-node';
import {ClusterRunner} from 'src/app/service/cluster/cluster-runner';
import {ClusterService} from 'src/app/service/cluster/cluster.service';

export interface IClusterData {
  scope: string;
  $workers: Observable<ClusterRunner[]>;
  $services: Observable<ClusterRunner[]>;
  $nodes: Observable<ClusterNode[]>;
}

@Component({
  selector: 'app-cluster-card',
  templateUrl: './cluster-card.component.html',
  styleUrls: ['./cluster-card.component.scss']
})
export class ClusterCardComponent {
  @Input()
  cluster: IClusterData;

  constructor () {
  }
}
