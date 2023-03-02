import {HttpClient, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {catchError, delay, map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {ErrorLevel} from './error/ErrorUtil';
import {NetError} from './error/NetError';
import {ServerError} from './error/ServerError';
import {UserError} from './error/UserError';
import {AuthHandler, GatewayHandler, RestfulHandler, ServiceName, UserErrorCode} from './server/api';

// tslint:disable-next-line
interface IRemoteService {}
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
type TypeOfClassMethod<T, M extends keyof T> = T[M] extends (...args: any) => any ? T[M] : never;
export type ConvertRouteMethod<T extends IRemoteService> = {
  [K in keyof T]: (body: Parameters<TypeOfClassMethod<T, K>>[0]) => Observable<ThenArg<ReturnType<TypeOfClassMethod<T, K>>>>;
};

interface IResNetResponse<T> {
  error: {
    code: string;
    message: string;
    level: ErrorLevel;
    name: string;
  };
  result: T;
}

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  gateway: ConvertRouteMethod<GatewayHandler>;
  restful: ConvertRouteMethod<RestfulHandler>;
  auth: ConvertRouteMethod<AuthHandler>;

  private token: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.token = localStorage.getItem('sora-http-session');
    this.gateway = this.createHttpService(ServiceName.HttpGateway);
    this.restful = this.createHttpService(ServiceName.Restful);
    this.auth = this.createHttpService(ServiceName.Auth);
  }

  private createHttpService<Handler extends IRemoteService>(name: ServiceName): ConvertRouteMethod<Handler> {
    return new Proxy({} as any, {
      get: (target, prop: string, receiver) => {
        return (body: unknown) => {
          return this.http.post<IResNetResponse<unknown>>(`${environment.server}${name}/${prop}`, body || {}, {
            withCredentials: true,
            observe: 'response',
            headers: {
              'sora-http-session': this.token ? this.token : '',
            }
          }).pipe(
            catchError((error: Error) => {
              throw new NetError(error.message);
            }),
            map(this.handleResponse.bind(this)),
            map(this.handlerResNetResponse.bind(this)),
          );
        };
      }
    });
  }

  private handleResponse(res: HttpResponse<IResNetResponse<unknown>>) {
    this.token = res.headers.get('sora-http-session');
    if (this.token)
      localStorage.setItem('sora-http-session', this.token);

    if (!res.body)
      throw new Error('ERR_EMPTY_REPONSE');
    return res.body;
  }

  private handlerResNetResponse(res: IResNetResponse<unknown>) {
    if (res.error) {
      switch (res.error.level) {
        case ErrorLevel.EXPECTED:
          if (res.error.code === UserErrorCode.ERR_NOT_LOGIN) {
            this.router.navigate(['/auth/login']);
          }
          throw new UserError(res.error.code as UserErrorCode, res.error.message);
        default:
          throw new ServerError(res.error.code);
      }
    }
    return res.result;
  }
}
