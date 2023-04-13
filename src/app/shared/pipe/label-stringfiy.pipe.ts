import { Pipe, PipeTransform } from '@angular/core';
import {ILabels} from 'src/app/service/server/api';

@Pipe({
  name: 'labelStringfiy'
})
export class LabelStringfiyPipe implements PipeTransform {

  transform(value: ILabels | undefined): string {
    if (!value)
      return '-';
    if (!Object.keys(value).length)
      return '-';
    return Object.entries(value).map(([key, value]) => `${key}: ${value} `).join(',');
  }

}
