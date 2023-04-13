import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-version-chip',
  templateUrl: './version-chip.component.html',
  styleUrls: ['./version-chip.component.scss']
})
export class VersionChipComponent {
  @Input()
  text: string;

  @Input()
  version: string;

  @Input()
  color: string;
}
