import { Component, EventEmitter, Input, Output } from '@angular/core';
import {WorkerState} from 'src/app/service/server/api';

@Component({
  selector: 'app-worker-state-badge',
  templateUrl: './worker-state-badge.component.html',
  styleUrls: ['./worker-state-badge.component.scss']
})
export class WorkerStateBadgeComponent {
  WorkerState = WorkerState;

  @Input()
  state?: WorkerState;

  @Input()
  text?: string;
}
