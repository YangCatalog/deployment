export class TreeItemDataModel {
  text = '';
  flags = '';
  opts = '';
  path = '';
  schema = '';
  sensorPath = '';
  showNodePath = '';
  status = '';
  type = '';
  title = '';

  constructor(data = {}) {
    this.text = data['data']['text'];
    this.title = data['data']['description'] || data['data']['title'];
    this.flags = data['data']['flags'];
    this.opts = data['data']['opts'];
    this.path = data['data']['path'];
    this.schema = data['data']['schema'];
    this.sensorPath = data['data']['sensor_path'] || data['data']['sensorPath'];
    this.showNodePath = data['data']['show_node_path'] || data['data']['showNodePath'];
    this.status = data['data']['status'];
    this.type = data['data']['type'];
  }

}
