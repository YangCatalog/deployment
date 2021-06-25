export class ModuleDetailsModel {
  currentModule: string;
  data: any;
  revisions: string[];

  constructor(data: any) {
    this.currentModule = data['current-module'];
    this.data = data['metadata'];

    if (this.data['implementations'] && this.data['implementations']['implementation']) {
      this.data['implementations'] = this.data['implementations']['implementation'];
    }

    this.revisions = data['revisions'];
  }

}
