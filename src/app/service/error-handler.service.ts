import { Injectable, ErrorHandler, NgZone } from '@angular/core';
import {BaseError} from './error/BaseError';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

  constructor(
    private message: NzMessageService,
    private readonly zone: NgZone
  ) {}

  public handle(err: Error) {
    console.error(err);
    if (err instanceof BaseError) {
      this.message.error(err.showMessage);
    } else {
      this.message.error(err.message);
    }
  }

  public handleError(err: Error) {
    // if (err.rejection) {
    //   this.handle(err.rejection);
    // } else {
    // }
    this.handle(err);
  }
}
