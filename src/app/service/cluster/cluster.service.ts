import { Injectable, ErrorHandler, NgZone } from '@angular/core';
import {BehaviorSubject, distinctUntilChanged, filter, map, Subscription, timeout} from 'rxjs';
import {IListenerMetaData, INodeClientNotifyHandler, INodeMetaData, INodeRunData, IServiceMetaData, IWorkerMetaData, NotifyUpdateType} from '../server/api';
import { ServerService, ServerState } from '../server/server.service';
import {ClusterNode} from './cluster-node';
import {ClusterRunner, ClusterRunnerType} from './cluster-runner';
import {ClusterListener} from './cluster-listener';

@Injectable({
  providedIn: 'root'
})
export class ClusterService {
  ready: boolean;
  $node: BehaviorSubject<ClusterNode[]> = new BehaviorSubject([] as ClusterNode[]);
  $runner: BehaviorSubject<ClusterRunner[]> = new BehaviorSubject([] as ClusterRunner[]);
  $listener: BehaviorSubject<ClusterListener[]> = new BehaviorSubject([] as ClusterListener[]);
  $cluster: BehaviorSubject<string[]> = new BehaviorSubject([] as string[]);

  constructor(
    private server: ServerService
  ) {
    this.ready = false;
  }

  startNotify() {
    this.clusterSubscription_ = this.server.notify<INodeClientNotifyHandler>().notifyClusterUpdate(() => {
      this.server.monitor.registerClusterUpdate().subscribe((res) => {
        for (const meta of res.nodeMetaData) {
          this.updateNodeMetaData(meta, meta.scope);
        }

        for (const run of res.nodeRunData) {
          this.updateNodeRunData(run, run.scope);
        }

        for (const service of res.serviceMetaData) {
          this.updateRunnerMetaData(service, ClusterRunnerType.Service, service.scope);
        }

        for (const worker of res.workerMetaData) {
          this.updateRunnerMetaData(worker, ClusterRunnerType.Worker, worker.scope);
        }

        for (const listener of res.listenerMetaData) {
          this.updateListenerMetaData(listener);
        }

        this.ready = true;
        this.onNodeUpdate();
        this.onRunnerUpdate();
        this.onListenerUpdate();
      });
    }, () => {
      this.server.monitor.unregisterClusterUpdate().subscribe();
    }).subscribe((notify) => {
      if (notify.node) {
        if (notify.node.data) {
          this.updateNodeMetaData(notify.node.data, notify.scope);
        } else {
          this.deleteNodeMetaData(notify.node.id);
        }

        this.onNodeUpdate();
      }


      if (notify.service) {
        if (notify.service.data) {
          this.updateRunnerMetaData(notify.service.data, ClusterRunnerType.Service, notify.scope);
        } else {
          this.deleteRunnerMetaData(notify.service.id);
        }

        this.onRunnerUpdate();
      }

      if (notify.worker) {
        if (notify.worker.data) {
          this.updateRunnerMetaData(notify.worker.data, ClusterRunnerType.Worker, notify.scope);
        } else {
          this.deleteRunnerMetaData(notify.worker.id);
        }

        this.onRunnerUpdate();
      }

      if (notify.listener) {
        if (notify.listener.data) {
          this.updateListenerMetaData(notify.listener.data);
        } else {
          this.deleteListenerMetaData(notify.listener.id);
        }

        this.onListenerUpdate();
      }

      if (notify.nodeRundata) {
        const update = notify.nodeRundata;
        switch (update.type) {
          case NotifyUpdateType.Create:
            const node = update.data;
            this.updateNodeMetaData(node.node, notify.scope);
            this.nodeMap_.get(node.node.id)?.setRunData(node);
            break;
          case NotifyUpdateType.Update:
            this.nodeMap_.get(update.id)?.updateRunData(update.diff);
            break;
          case NotifyUpdateType.Delete:
            this.nodeMap_.get(update.id)?.deleteRunData();
            break;
        }

        this.onNodeUpdate();
      }
    });
  }

  startup() {
    this.nodeMap_ = new Map();
    this.runnerMap_ = new Map();
    this.listenerMap_ = new Map();

    this.startNotify();

    this.serverSubscription_ = this.server.$state
    .pipe(
      distinctUntilChanged()
    ).subscribe((state) => {
      switch(state) {
        case ServerState.DISCONNECTED:
          setTimeout(() => {
            this.startNotify();
          }, 5000);
      }
    });
  }

  shutdown() {
    if (this.clusterSubscription_)
      this.clusterSubscription_.unsubscribe();
    if (this.serverSubscription_)
      this.serverSubscription_.unsubscribe();
  }

  getNode(id: string) {
    return this.nodeMap_.get(id);
  }

  getRunner(id: string) {
    return this.runnerMap_.get(id);
  }

  getRunnersByNodeId(id: string) {
    return [...this.runnerMap_].map(([_, runner]) => runner).filter(runner => runner.data.nodeId === id);
  }

  getListener(id: string) {
    return this.listenerMap_.get(id);
  }

  observeRunnersByNodeId(id: string) {
    return this.$runner.pipe(
      map(list => list.filter(runner => runner.data.nodeId === id))
    );
  }

  private updateNodeRunData(run: INodeRunData, scope: string) {
    if (this.nodeMap_.get(run.node.id)) {
      this.nodeMap_.get(run.node.id)?.setRunData(run);
    } else {
      const clusterNode = new ClusterNode(this, run.node, scope)
      this.nodeMap_.set(run.node.id, clusterNode);
      clusterNode.setRunData(run);
    }
  }

  private deleteNodeMetaData(id: string) {
    this.nodeMap_.delete(id);
  }

  private updateNodeMetaData(node: INodeMetaData, scope: string) {
    if (this.nodeMap_.get(node.id)) {
      this.nodeMap_.get(node.id)?.updateMeta(node);
    } else {
      this.nodeMap_.set(node.id, new ClusterNode(this, node, scope));
    }
  }

  private updateRunnerMetaData(meta: IServiceMetaData | IWorkerMetaData, type: ClusterRunnerType, scope: string) {
    if (this.runnerMap_.get(meta.id)) {
      this.runnerMap_.get(meta.id)?.updateData(meta);
    } else {
      this.runnerMap_.set(meta.id, new ClusterRunner(this, type, meta, scope));
    }
  }

  private deleteRunnerMetaData(id: string) {
    this.runnerMap_.delete(id);
  }

  private updateListenerMetaData(meta: IListenerMetaData) {
    if (this.listenerMap_.get(meta.id)) {
      this.listenerMap_.get(meta.id)?.updateMeta(meta);
    } else {
      this.listenerMap_.set(meta.id, new ClusterListener(this, meta));
    }
  }

  private deleteListenerMetaData(id: string) {
    this.listenerMap_.delete(id);
  }


  private onNodeUpdate() {
    this.$node.next([...this.nodeMap_].map(([_, node]) => node));
    const clusterSet = new Set<string>();
    for (const [_, node] of [...this.nodeMap_]) {
      clusterSet.add(node.scope);
    }
    this.$cluster.next([...clusterSet]);
  }

  private onRunnerUpdate() {
    this.$runner.next([...this.runnerMap_].map(([_, runner]) => runner));
  }

  private onListenerUpdate() {
    this.$listener.next([...this.listenerMap_].map(([_, listener]) => listener));
  }

  private clusterSubscription_?: Subscription;
  private serverSubscription_: Subscription;
  private nodeMap_: Map<string, ClusterNode>;
  private runnerMap_: Map<string, ClusterRunner>;
  private listenerMap_: Map<string, ClusterListener>;
}
