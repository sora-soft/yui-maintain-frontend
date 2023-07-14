import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, map, Observable, Subject} from 'rxjs';
import {environment} from 'src/environments/environment';
import {ErrorLevel} from '../error/ErrorUtil';
import {NetError} from '../error/NetError';
import {ServerError} from '../error/ServerError';
import {UserError} from '../error/UserError';
import {ServiceName, UserErrorCode} from './api';
import {ConvertRouteMethod, IRemoteHandler, IResNetResponse, ServerService} from './server.service';
import {TokenService} from './token.service';

@Injectable({
  providedIn: 'root'
})
export class HttpServerService extends ServerService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private token: TokenService,
  ) {
    super();
  }

  createNotifyObserver<T>(name: string, subscribe: () => void, unsubscribe: () => void): Observable<T> {
    throw new Error('HttpClient not support notify observer');
  }

  protected createApi<Handler extends IRemoteHandler>(name: ServiceName): ConvertRouteMethod<Handler> {
    return new Proxy({} as any, {
      get: (target, prop: string, receiver) => {
        return (body: unknown) => {
          let header: HttpHeaders = new HttpHeaders();
          if (this.token.token) {
            header = header.set('authorization', `sora-rpc-authorization ${this.token.token}`);
            header = header.set('rpc-authorization', this.token.token);
          }

          return this.http.post<IResNetResponse<unknown>>(`${environment.httpEndpoint}${name}/${prop}`, body || {}, {
            withCredentials: true,
            observe: 'response',
            headers: header,
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
