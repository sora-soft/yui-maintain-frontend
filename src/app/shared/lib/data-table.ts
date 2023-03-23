import {ErrorHandler} from '@angular/core';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {ServerService} from 'src/app/service/server/server.service'
import {FindOptionsOrderValue, IReqFetch, ObjectLiteral} from 'src/app/service/server/api'

abstract class DataTable<T extends ObjectLiteral> {

  tableScroll = 0;

  list: T[] = [];
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  sort: IReqFetch<T>['order'];

  constructor(
    protected db_: string,
    protected server_: ServerService,
    protected errorHandler_: ErrorHandler,
    protected relations_?: IReqFetch<T>['relations'],
    protected select_?: string[],
  ) {}

  onQueryParamsChange(event: NzTableQueryParams) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.sort = {};
    for (const sort of event.sort) {
      let value: FindOptionsOrderValue | null = null;
      switch (sort.value) {
        case 'ascend':
          value = 1;
          break;
        case'descend':
          value = -1
          break;
      }
      if (value) {
        this.sort[sort.key as keyof T] = value;
      }
    }

    if (!Object.keys(this.sort))
      this.sort = undefined;
    this.updateData();
  }

  updateData() {
    this.loading = true;
    const request: IReqFetch<T> = {
      db: this.db_,
      relations: this.relations_,
      offset: this.pageSize * (this.pageIndex - 1),
      limit: this.pageSize,
      order: this.sort,
    };
    if (this.select_ && this.select_.length) {
      request.select = this.select_;
    }
    this.server_.restful.fetch(request).subscribe({
      next: (res) => {
        this.list = res.list as T[];
        this.loading = false;
        this.total = res.total;
      },
      error: (err) => {
        this.errorHandler_.handleError(err);
        this.loading = false;
        console.log(err);
      }
    })
  }
}

export {DataTable}
