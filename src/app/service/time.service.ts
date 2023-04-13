import {Injectable} from '@angular/core';
import {BehaviorSubject, interval, map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  $unixNow = new BehaviorSubject(Math.floor(Date.now() / 1000))
  constructor() {
    interval(1000).subscribe(() => {
      this.$unixNow.next(Math.floor(Date.now() / 1000));
    })
  }
}
