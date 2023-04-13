import { Component } from '@angular/core';
import {ClusterService} from 'src/app/service/cluster/cluster.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent {
    constructor(
    public cluster: ClusterService,
  ) {}
}
