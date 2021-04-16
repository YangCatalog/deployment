import { TreeItemDataModel } from './tree-item-data-model';

export class TreeItemTableRowModel extends TreeItemDataModel {

  level: number;
  parent: TreeItemTableRowModel = null;
  children: TreeItemTableRowModel[] = [];
  groupCollapsed = true;


  constructor(data = {}, level = 0, parent = null) {
    super(data);
    this.level = level;
    this.parent = parent;
    if (this.parent) {
      this.parent.registerChild(this);
    }
  }

  registerChild(child: TreeItemTableRowModel): void {
    this.children.push(child);
  }

  collapseGroup(): void {
    this.groupCollapsed = true;
    this.children.forEach(child => child.collapseGroup());
  }

  expandGroup(): void {
    this.groupCollapsed = false;
    this.children.forEach(child => child.expandGroup());
  }

}
