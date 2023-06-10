import {IServiceMetaData, IWorkerMetaData} from '../server/api';
import {ClusterService} from './cluster.service';

export enum ClusterRunnerType {
  Worker = 'worker',
  Service = 'service',
}

export class ClusterRunner {
  private cluster_: ClusterService;
  private type_: ClusterRunnerType;
  private data_: IWorkerMetaData | IServiceMetaData;
  private scope_: string;

  constructor(cluster: ClusterService, type: ClusterRunnerType, data: IWorkerMetaData | IServiceMetaData, scope: string) {
    this.type_ = type;
    this.data_ = data;
    this.cluster_ = cluster;
    this.scope_ = scope;
  }

  updateData(data: IWorkerMetaData | IServiceMetaData) {
    this.data_ = data;
  }

  get labels() {
    if (this.type_ === ClusterRunnerType.Service) {
      return (this.data_ as IServiceMetaData).labels;
    } else {
      return {};
    }
  }

  get node() {
    return this.cluster_.getNode(this.data.nodeId);
  }

  get alias() {
    return (this.data_.alias || this.data_.name);
  }

  get name() {
    return this.data_.name;
  }

  get type() {
    return this.type_;
  }

  get data() {
    return this.data_;
  }

  get id() {
    return this.data_.id;
  }

  get scope() {
    return this.scope_;
  }
}
