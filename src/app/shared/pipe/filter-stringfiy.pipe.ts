import { Pipe, PipeTransform } from '@angular/core';
import {FilterOperator, ILabelData} from 'src/app/service/server/api';

@Pipe({
  name: 'filterStringfiy'
})
export class FilterStringfiyPipe implements PipeTransform {

  static operateMap = {
    [FilterOperator.EXCLUDE]: '不包含',
    [FilterOperator.INCLUDE]: '包含'
  }

  transform(value: ILabelData[]): string {
    if (!value)
      return '-'
    if (!value.length)
      return '-'

    return value.map(label => `${label.label} ${FilterStringfiyPipe.operateMap[label.operator]} [${label.values.map(v => `'${v}'`).join(',')}]`).join('&');
  }

}
