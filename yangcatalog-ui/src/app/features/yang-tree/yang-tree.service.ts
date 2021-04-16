import { Injectable } from '@angular/core';
import { DataService } from '../../core/data.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TreeModel } from './models/tree-model';
import { map } from 'rxjs/operators';
import { TreeItemTableRowModel } from './models/tree-item-table-row-model';
import { TreeItemModel } from './models/tree-item-model';

@Injectable({
  providedIn: 'root'
})
export class YangTreeService extends DataService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getTree(modelName: string, revision: string): Observable<TreeModel> {
    return this.httpClient.get('api/yang-search/v2/tree/' + modelName + '@' + revision)
      .pipe(
        map(
          response => {
            return new TreeModel(response);
          }
        )
      );
  }

  transformTreeToTablerows(tree: TreeModel): TreeItemTableRowModel[] {
    let result: TreeItemTableRowModel[] = [];
    tree.data.forEach((treeItem: TreeItemModel) => {
      result = result.concat(this.transformTreeitemToRows(treeItem));
    });
    return result;
  }

  private transformTreeitemToRows(treeItem: TreeItemModel, level = 0, parent = null): TreeItemTableRowModel[] {
    const rowData = {
      text: treeItem['text'],
      title: treeItem['title'],
      data: treeItem,
    };
    const myTreeRow = new TreeItemTableRowModel(rowData, level, parent);
    let result: TreeItemTableRowModel[] = [myTreeRow];
    treeItem.children.forEach((treeChild: TreeItemModel) => {
      result = result.concat(this.transformTreeitemToRows(treeChild, level + 1, myTreeRow));
    });
    return result;

  }
}
