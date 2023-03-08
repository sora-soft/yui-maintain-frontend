import {Observable} from 'rxjs';
import {ErrorLevel} from '../error/ErrorUtil';
import {AuthHandler, GatewayHandler, RestfulHandler, ServiceName, UserErrorCode} from './api';

// tslint:disable-next-line
export interface IRemoteHandler {}
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
type TypeOfClassMethod<T, M extends keyof T> = T[M] extends (...args: any) => any ? T[M] : never;
export type ConvertRouteMethod<T extends IRemoteHandler> = {
  [K in keyof T]: (body: Parameters<TypeOfClassMethod<T, K>>[0]) => Observable<ThenArg<ReturnType<TypeOfClassMethod<T, K>>>>;
};

export interface IResNetResponse<T> {
  error: {
    code: string;
    message: string;
    level: ErrorLevel;
    name: string;
  };
  result: T;
}

export abstract class ServerService {
  gateway: ConvertRouteMethod<GatewayHandler>;
  restful: ConvertRouteMethod<RestfulHandler>;
  auth: ConvertRouteMethod<AuthHandler>;

  constructor() {
    this.gateway = this.createApi(ServiceName.HttpGateway);
    this.restful = this.createApi(ServiceName.Restful);
    this.auth = this.createApi(ServiceName.Auth);
  }

  protected abstract createApi<Handler extends IRemoteHandler>(name: ServiceName): ConvertRouteMethod<Handler>;
}
