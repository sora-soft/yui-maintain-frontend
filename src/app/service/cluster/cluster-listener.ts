import {Observable, Subscription} from 'rxjs';
import {IListenerMetaData} from '../server/api';
import {ClusterRunner} from './cluster-runner';
import {ClusterService} from './cluster.service';

export class ClusterListener {
  constructor(cluster: ClusterService, data: IListenerMetaData) {
    this.meta_ = data;
    this.cluster_ = cluster;
  }

  updateMeta(meta: IListenerMetaData) {
    this.meta_ = meta;
  }

  get meta() {
    return this.meta_;
  }

  get id() {
    return this.meta_.id;
  }

  get service() {
    return this.cluster_.getRunner(this.meta.targetId);
  }

  get node() {
    return this.service?.node;
  }

  private meta_: IListenerMetaData;
  private cluster_: ClusterService;
}
