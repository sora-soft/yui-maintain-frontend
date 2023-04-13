import { Component, Input, OnInit } from '@angular/core';
import {NzTreeNodeOptions} from 'ng-zorro-antd/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';

interface TreeNode {
  // name: string;
  key: string;
  value: string;
  type: string;
  disabled?: boolean;
  children?: TreeNode[];
}

interface FlatNode {
  expandable: boolean;
  key: string;
  value: string;
  level: number;
  disabled: boolean;
}

// const TREE_DATA: TreeNode[] = [
//   {
//     name: 'parent 1',
//     children: [
//       {
//         name: 'parent 1-0',
//         disabled: true,
//         children: [{ name: 'leaf' }, { name: 'leaf' }]
//       },
//       {
//         name: 'parent 1-1',
//         children: [{ name: 'leaf' }]
//       }
//     ]
//   }
// ];

@Component({
  selector: 'app-json-options-tree',
  templateUrl: './json-options-tree.component.html',
  styleUrls: ['./json-options-tree.component.scss']
})
export class JsonOptionsTreeComponent implements OnInit {
  @Input()
  options: Object;

  ngOnInit(): void {
    this.dataSource.setData([{
      key: 'option',
      value: '{}',
      type: 'object',
      children: this.generateNodes(this.options),
    }]);
  }

  private transformer = (node: TreeNode, level: number): FlatNode => ({
    expandable: !!node.children && node.children.length > 0,
    key: node.key,
    value: node.value,
    level,
    disabled: !!node.disabled
  });

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {

    // this.treeControl.expandAll();
  }

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;

  private generateNodes(obj: Object) {
    const result: TreeNode[] = [];
    Object.entries(obj).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        result.push({
          key,
          value: '[]',
          type: 'array',
          children: this.generateNodes(value),
        });
        return;
      }

      if(value instanceof Object) {
        result.push({
          // title: `${key}: {}`,
          key,
          value: '{}',
          type: 'object',
          children: this.generateNodes(value),
        });
        return;
      }

      result.push({
        // title: `${key}: ${value.toString()}`,
        key,
        value,
        type: typeof value,
      })
    })

    return result;
  }

  private id_ = 0;
}
