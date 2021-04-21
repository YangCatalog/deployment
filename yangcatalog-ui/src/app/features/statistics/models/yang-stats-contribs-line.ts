export class YangStatsContribsLine {
  name: string;
  numCatalog: number;
  numGithub: number;
  percentageCompile: number;
  percentageExtra: number;

  constructor(data = {}) {
    this.name = data['name'];
    this.numCatalog = data['num_catalog'];
    this.numGithub = parseInt(data['num_github'], 10);
    this.percentageCompile = data['percentage_compile'];
    this.percentageExtra = data['percentage_extra'];
  }
}
