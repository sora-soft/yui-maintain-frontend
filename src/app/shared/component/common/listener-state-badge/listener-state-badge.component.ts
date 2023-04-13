import { Component, Input } from '@angular/core';
import {ListenerState} from 'src/app/service/server/api';

@Component({
  selector: 'app-listener-state-badge',
  templateUrl: './listener-state-badge.component.html',
  styleUrls: ['./listener-state-badge.component.scss']
})
export class ListenerStateBadgeComponent {
  ListenerState = ListenerState;

  @Input()
  state?: ListenerState;

  @Input()
  text?: string;
}
