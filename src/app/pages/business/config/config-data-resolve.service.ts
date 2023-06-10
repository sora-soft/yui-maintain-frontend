import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {map} from 'rxjs';
import {ServerService} from 'src/app/service/server/server.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigDataResolveService {

  constructor(
    private server: ServerService,
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const name = route.paramMap.get('name') || '';
    return this.server.restful.fetch({
      db: 'config-file',
      where: {
        name,
      }
    }).pipe(
      map(res => res.list[0])
    )
  }
}
