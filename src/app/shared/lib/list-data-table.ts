import {Input} from '@angular/core';

abstract class ListTable<T> {
  private list_: T[]

  @Input()
  set list(value: T[]) {
    this.list_ = value;
  }

  get list() {
    return this.list_;
  }
}
