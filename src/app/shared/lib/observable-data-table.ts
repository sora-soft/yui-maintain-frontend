import {Observable} from 'rxjs';

abstract class ObservableDataTable<T> {

  tableScroll = 0;

  abstract list: T[];
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  // sort: IReqFetch<T>['order'];

  constructor() {}
}

export {ObservableDataTable}
