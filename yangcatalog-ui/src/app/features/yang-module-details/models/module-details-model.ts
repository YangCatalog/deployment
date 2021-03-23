export class ModuleDetailsModel {
  currentModule: string;
  data: any;
  revisions: string[];

  constructor(data: any) {
    this.currentModule = data['current-module'];
    this.data = data['metadata'];
    this.revisions = data['revisions'];
  }

}
