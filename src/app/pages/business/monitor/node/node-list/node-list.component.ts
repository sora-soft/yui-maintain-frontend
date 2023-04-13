import { Component } from '@angular/core';
import {ClusterService} from 'src/app/service/cluster/cluster.service';

@Component({
  selector: 'app-node-list',
  templateUrl: './node-list.component.html',
  styleUrls: ['./node-list.component.scss']
})
export class NodeListComponent {
  constructor(
    public cluster: ClusterService,
  ) {}
}
