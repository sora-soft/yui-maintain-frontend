import { Component } from '@angular/core';
import {ServerService, ServerState} from 'src/app/service/server/server.service';

@Component({
  selector: 'app-network-state',
  templateUrl: './network-state.component.html',
  styleUrls: ['./network-state.component.scss']
})
export class NetworkStateComponent {
  ServerState = ServerState;

  constructor(
    public server: ServerService,
  ) {}
}
