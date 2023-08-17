import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {ErrorLevel} from '../error/ErrorUtil';
import {AuthHandler, MonitorHandler, RestfulHandler, ServiceName} from './api';

// tslint:disable-next-line
export interface IRemoteHandler {}
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
type TypeOfClassMethod<T, M extends keyof T> = T[M] extends (...args: any) => any ? T[M] : never;
export type ConvertRouteMethod<T extends IRemoteHandler> = {
  [K in keyof T]: (body: Parameters<TypeOfClassMethod<T, K>>[0]) => Observable<ThenArg<ReturnType<TypeOfClassMethod<T, K>>>>;
};
export type ConvertRouteNotify<T extends IRemoteHandler> = {
  [K in keyof T]: (subscribe: () => void, unsubscribe: () => void) => Observable<Parameters<TypeOfClassMethod<T, K>>[0]>;
}

export interface IResNetResponse<T> {
  error: {
    code: string;
    message: string;
    level: ErrorLevel;
    name: string;
  };
  result: T;
}

export enum ServerState {
  DISCONNECTED,
  CONNECTED,
}

export abstract class ServerService {
  restful: ConvertRouteMethod<RestfulHandler>;
  auth: ConvertRouteMethod<AuthHandler>;
  monitor: ConvertRouteMethod<MonitorHandler>;

  $state = new BehaviorSubject(ServerState.DISCONNECTED);

  constructor() {
    this.restful = this.createApi(ServiceName.Restful);
    this.auth = this.createApi(ServiceName.Auth);
    this.monitor = this.createApi(ServiceName.Monitor);
  }

  protected abstract createApi<Handler extends IRemoteHandler>(name: ServiceName): ConvertRouteMethod<Handler>;

  public notify<T extends IRemoteHandler>(): ConvertRouteNotify<T> {
    return new Proxy({} as ConvertRouteNotify<T>, {
      get: (target, prop: string) => {
        return (subscribe: () => void, unsubscribe: () => void) => {
          return this.createNotifyObserver(prop, subscribe, unsubscribe);
        }
      }
    })
  }
  protected abstract createNotifyObserver<T>(name: string, subscribe: () => void, unsubscribe: () => void): Observable<T>;
}
