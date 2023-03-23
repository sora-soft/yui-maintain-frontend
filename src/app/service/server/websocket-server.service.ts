import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ServiceName, UserErrorCode} from './api';
import {ConvertRouteMethod, IRemoteHandler, ServerService} from './server.service';
import { environment } from 'src/environments/environment';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {ErrorLevel} from '../error/ErrorUtil';
import {exhaustAll, from, map, Observable, Subject, timeout} from 'rxjs';
import {TokenService} from './token.service';
import {UserError} from '../error/UserError';
import {ServerError} from '../error/ServerError';

export type IRawNetPacket<T = unknown> = IRawReqPacket<T> | IRawResPacket<unknown> | IRawOperationPacket;

export enum OPCode {
  REQUEST = 1,
  RESPONSE = 2,
  NOTIFY = 3,
  OPERATION = 4,
}

export interface IRawReqPacket<T = unknown> {
  opcode: OPCode.REQUEST | OPCode.NOTIFY;
  method: string;
  path: string;
  headers: {
    [key: string]: any;
  };
  payload: T;
}

export interface IRawOperationPacket {
  opcode: OPCode.OPERATION;
  command: string;
  args: any;
}

export interface IPayloadError {
  code: string;
  message: string;
  level: ErrorLevel;
  name: string;
}

export interface IRawResPacket<T = unknown> {
  opcode: OPCode.RESPONSE;
  headers: {
    [key: string]: any;
  };
  payload: IResPayloadPacket<T>;
}

export interface IResPayloadPacket<T = unknown> {
  error: IPayloadError | null;
  result: T | null;
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketServerService extends ServerService {
  constructor(
    private router: Router,
    private token: TokenService,
  ) {
    super();
    this.createWebsocketClient();
  }

  protected createApi<Handler extends IRemoteHandler>(name: ServiceName): ConvertRouteMethod<Handler> {
    // return from
    return new Proxy({} as any, {
      get: (target, prop: string, receiver) => {
        return (body: unknown) => {
          this.rpcId_ ++;

          return this.createWebsocketClient().pipe(
            timeout({first: 1000 * 10}),
            map((client) => {
              const subject = new Subject();
              this.subjectPool_.set(this.rpcId_, subject);
              client.next({
                opcode: OPCode.REQUEST,
                headers: {
                  'rpc-id': this.rpcId_,
                  'rpc-authorization': this.token.token,
                },
                payload: body || {},
                path: `${name}/${prop}`,
                method: prop,
              });
              return subject;
            }),
            exhaustAll(),
          );
        };
      }
    });
  }

  private createWebsocketClient() {
    const observable = new Observable<WebSocketSubject<IRawNetPacket<unknown>>>((subscriber) => {
      if (this.client_) {
        subscriber.next(this.client_);
        subscriber.complete();
        return;
      }
      const client = this.client_ = webSocket<IRawNetPacket>(environment.websocketEndpoint);
      client.subscribe({
        next: (message) => {
          console.log(message);
          this.handleIncomeMessage(client, message);
        },
        error: () => {
          this.client_ = null;
        }
      });
      subscriber.next(client);
      subscriber.complete();
    });
    return observable;
  }

  private handleIncomeMessage(client: WebSocketSubject<IRawNetPacket<unknown>>, message: IRawNetPacket) {
    switch(message.opcode) {
      case OPCode.OPERATION: {
        this.handleCommand(client, message);
        break;
      }
      case OPCode.RESPONSE: {
        this.handleResponse(client, message);
        break;
      }
    }
  }

  private handleResponse(client: WebSocketSubject<IRawNetPacket<unknown>>, message: IRawResPacket) {
    const rpcId = message.headers['rpc-id'];
    const subject = this.subjectPool_.get(rpcId);

    if (!subject)
      return;

    if (message.payload.error) {
      let error: Error | null = null;
      switch (message.payload.error.level) {
        case ErrorLevel.EXPECTED:
          if (message.payload.error.code === UserErrorCode.ERR_NOT_LOGIN) {
            this.router.navigate(['/auth/login']);
          }
          error = new UserError(message.payload.error.code as UserErrorCode, message.payload.error.message);
          break;
        default:
          error = new ServerError(message.payload.error.code);
      }
      subject.error(error);
    } else {
      subject.next(message.payload.result);
    }
  }

  private handleCommand(client: WebSocketSubject<IRawNetPacket<unknown>>, message: IRawOperationPacket) {
    switch(message.command) {
      case 'ping': {
        client.next({
          opcode: OPCode.OPERATION,
          command: 'pong',
          args: message.args,
        });
        break;
      }
    }
  }

  private client_: WebSocketSubject<IRawNetPacket<unknown>> | null;
  private rpcId_ = 0;
  private subjectPool_ = new Map<number, Subject<unknown>>();
}
