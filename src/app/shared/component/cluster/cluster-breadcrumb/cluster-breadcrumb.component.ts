import { Component, Input } from '@angular/core';
import {ClusterListener} from 'src/app/service/cluster/cluster-listener';
import {ClusterNode} from 'src/app/service/cluster/cluster-node';
import {ClusterRunner} from 'src/app/service/cluster/cluster-runner';

@Component({
  selector: 'app-cluster-breadcrumb',
  templateUrl: './cluster-breadcrumb.component.html',
  styleUrls: ['./cluster-breadcrumb.component.scss']
})
export class ClusterBreadcrumbComponent {
  @Input()
  cluster?: string;

  @Input()
  node?: ClusterNode | null;

  @Input()
  runner?: ClusterRunner | null;

  @Input()
  listener?: ClusterListener | null;
}
