import { Component, Input } from '@angular/core';
import {ConnectorState} from 'src/app/service/server/api';

@Component({
  selector: 'app-connector-state-badge',
  templateUrl: './connector-state-badge.component.html',
  styleUrls: ['./connector-state-badge.component.scss']
})
export class ConnectorStateBadgeComponent {
  ConnectorState = ConnectorState;

  @Input()
  state?: ConnectorState;

  @Input()
  text?: string;
}
