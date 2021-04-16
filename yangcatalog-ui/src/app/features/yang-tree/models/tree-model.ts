import { TreeItemModel } from './tree-item-model';

export class TreeModel {

  data: TreeItemModel[] = [];
  module: string;
  namespace: string;
  prefix: string;

  moduleName: string;
  moduleRevision: string;


  constructor(data = {}) {
    this.module = data['module'];
    this.namespace = data['namespace'];
    this.prefix = data['prefix'];

    this.setNameAndRevision();

    if (data['jstree_json'] && data['jstree_json']['data']) {
      this.data = data['jstree_json']['data'].map(itemData => {
        return new TreeItemModel(itemData);
      });
    }
  }

  private setNameAndRevision() {
    const moduleArr = this.module.split('@');
    this.moduleName = moduleArr[0];
    this.moduleRevision = moduleArr[1];
  }
}
