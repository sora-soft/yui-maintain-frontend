import {ErrorHandler, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, UrlSegment} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ServerService} from '../../service/server/server.service';
import {UserService} from '../../service/user.service';

@Injectable()
export class BusinessCanActivate implements CanActivate {
  constructor(
    private router: Router,
    private user: UserService,
    private server: ServerService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log(132456);
    return this.server.gateway.info().pipe(
      map((result) => {
        this.user.login(result.account, result.permissions, result.authorization.token, result.authorization.expireAt);
        return true;
      }),
      catchError((err) => {
        console.log(err);
        return of(false);
      }),
      map((result) => {
        if (!result) {
          return this.router.parseUrl('/auth/login');
        } else {
          return result;
        }
      }),
    );
  }
}
