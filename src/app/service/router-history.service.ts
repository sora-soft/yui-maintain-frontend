import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

export interface IRouteHistory {
  id: number;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class RouterHistoryService {
  private history = [] as IRouteHistory[];

  constructor(
    private router : Router
  ) {}

  start() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const pre = this.history.at(-1);
        if (pre && pre.url === event.urlAfterRedirects)
          return;
        this.history.push({id: event.id, url: event.urlAfterRedirects});
      };
    });
  }

  getPrevious(prefix: string) {
    for (const history of this.history.slice(0).reverse()) {
      if (history.url.indexOf(prefix) !== 0)
        return history;
    }
    return undefined;
  }

  back(history: IRouteHistory | undefined, fallback: string) {
    if (!history) {
      this.router.navigateByUrl(fallback);
      return;
    }
    const index = this.history.findIndex(his => his.id === history.id);
    if (index >= 0) {
      this.history.splice(index + 1);
      this.router.navigateByUrl(history.url);
    } else {
      this.router.navigateByUrl(fallback);
    }
  }
}
