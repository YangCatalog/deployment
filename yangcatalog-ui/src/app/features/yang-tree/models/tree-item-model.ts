import { TreeItemDataModel } from './tree-item-data-model';

export class TreeItemModel extends TreeItemDataModel {

  children: TreeItemModel[] = [];

  constructor(data = {}) {
    super(data);
    if (data['children']) {
      this.children = data['children'].map(chData => new TreeItemModel(chData));
    }

  }
}
