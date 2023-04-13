import {Delta, INodeMetaData, INodeRunData, IProviderMetaData, IServiceMetaData, IWorkerMetaData, WorkerState} from '../server/api';
import * as jsondiffpath from 'jsondiffpatch';
import {ClusterRunner, ClusterRunnerType} from './cluster-runner';
import {ClusterService} from './cluster.service';

class ClusterNode {
  constructor(cluster: ClusterService, data: INodeMetaData, scope: string) {
    this.meta_ = data;
    this.cluster_ = cluster;
    this.scope_ = scope;
  }

  updateMeta(meta: INodeMetaData) {
    this.meta_ = meta;
  }

  setRunData(data: INodeRunData) {
    this.run_ = data;
  }

  updateRunData(diff: Delta) {
    this.run_ = jsondiffpath.patch(this.run_, diff);
  }

  deleteRunData() {
    this.run_ = null;
  }

  isBusy() {
    return this.meta_.state === WorkerState.READY  && !this.run_;
  }

  get name() {
    return (this.meta_.alias || this.meta_.id);
  }

  get id() {
    return this.meta_.id;
  }

  get runErrorCount() {
    return this.runners.filter(runner => runner.data.state === WorkerState.ERROR).length;
  }

  get meta() {
    return this.meta_;
  }

  get run() {
    return this.run_;
  }

  get discovery() {
    return this.run_?.discovery;
  }

  get services(): ClusterRunner[] {
    return this.runners.filter(runner => runner.type === ClusterRunnerType.Service);
  }

  get workers(): ClusterRunner[] {
    return this.runners.filter(runner => runner.type === ClusterRunnerType.Worker);
  }

  get runners(): ClusterRunner[] {
    return this.cluster_.getRunnersByNodeId(this.id);
  }

  get providers(): IProviderMetaData[] {
    return this.run_?.providers || [];
  }

  get scope() {
    return this.scope_;
  }

  private meta_: INodeMetaData;
  private run_: INodeRunData | null;
  // private runnerMap_: Map<string, ClusterRunner>;
  private cluster_: ClusterService;
  private scope_: string;
}

export {ClusterNode}
