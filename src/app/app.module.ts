import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ErrorHandlerService } from './service/error-handler.service';
import {NzMessageModule} from 'ng-zorro-antd/message';
import {ServerService} from './service/server/server.service';
import {HttpServerService} from './service/server/http-server.service';
import {WebsocketServerService} from './service/server/websocket-server.service';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzMessageModule,
  ],
  providers: [
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: ServerService, useClass: WebsocketServerService },
    // { provide: ServerService, useClass: HttpServerService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
