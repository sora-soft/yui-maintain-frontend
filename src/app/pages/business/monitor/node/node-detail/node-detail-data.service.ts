import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ClusterNode} from 'src/app/service/cluster/cluster-node';

@Injectable({
  providedIn: 'root'
})
export class NodeDetailDataService {
  $nodeDetail = new BehaviorSubject<ClusterNode | null>(null);
  constructor() {}
}
