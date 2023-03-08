import { Injectable, ErrorHandler, NgZone } from '@angular/core';
import {from, map, of} from 'rxjs';
import {ServerService} from './server/server.service';
import {AuthGroup} from './server/api';

@Injectable({
  providedIn: 'root'
})
export class AuthGroupService {
  private authGroup: AuthGroup[];

  constructor(
    private server: ServerService,
  ) {}

  get $authGroup() {
    if (this.authGroup) {
      return from([this.authGroup]);
    } else {
      return this.server.restful.fetch({
        db: 'auth-group',
      }).pipe(
        map((res) => {
          this.authGroup = res.list as AuthGroup[];
          return res.list as AuthGroup[];
        })
      )
    }
  }
}
