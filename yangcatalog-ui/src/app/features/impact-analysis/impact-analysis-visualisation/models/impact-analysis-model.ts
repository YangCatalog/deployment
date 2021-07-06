import { ImpactVisNodeModel } from './impact-vis-node-model';

export class ImpactAnalysisModel {
  dependencies: ImpactAnalysisModel[];
  dependents: ImpactAnalysisModel[];
  document: string;
  maturity: string;
  name: string;
  organization: string;
  revision: string;


  constructor(data = {}) {
    this.document = data['document-name'];
    this.maturity = data['maturity-level'];
    this.name = data['name'];
    this.organization = data['organization'];
    this.revision = data['revision'];

    this.dependencies = data['dependencies'] ? data['dependencies'].map(dep => new ImpactAnalysisModel(dep)) : [];
    this.dependents = data['dependents'] ? data['dependents'].map(dep => new ImpactAnalysisModel(dep)) : [];
  }

  getOrganisations(): string[] {
    const result = {};

    if (this.organization) {
      result[this.organization] = 1;
    }
    this.dependencies.forEach(dep => dep.getOrganisations().forEach(org => result[org] = 1));
    this.dependents.forEach(dep => dep.getOrganisations().forEach(org => result[org] = 1));
    return Object.keys(result);
  }

  getOrganizationMembersCount(orgName: string): number {
    let result = this.organization === orgName ? 1 : 0;

    this.dependencies.forEach(dep => result += dep.getOrganizationMembersCount(orgName));
    this.dependents.forEach(dep => result += dep.getOrganizationMembersCount(orgName));

    return result;
  }

  getOrganizationMembers(orgName: string): ImpactVisNodeModel[] {

    let result = [];
    if (this.organization === orgName) {
      result.push(this);
    }

    this.dependencies.forEach(dep => result = result.concat(dep.getOrganizationMembers(orgName)));
    this.dependents.forEach(dep => result = result.concat(dep.getOrganizationMembers(orgName)));

    return result;
  }

  getMaturityMembers(maturity: string): ImpactVisNodeModel[] {

    let result = [];
    if (this.maturity === maturity) {
      result.push(this);
    }

    this.dependencies.forEach(dep => result = result.concat(dep.getMaturityMembers(maturity)));
    this.dependents.forEach(dep => result = result.concat(dep.getMaturityMembers(maturity)));

    return result;
  }

  getMaturityMembersCount(maturity: string): number {
    let result = this.maturity === maturity ? 1 : 0;

    this.dependencies.forEach(dep => result += dep.getMaturityMembersCount(maturity));
    this.dependents.forEach(dep => result += dep.getMaturityMembersCount(maturity));

    return result;
  }

  getMaturities(): string[] {
    const result = {};

    if (this.maturity) {
      result[this.maturity] = 1;
    }
    this.dependencies.forEach(dep => dep.getMaturities().forEach(mat => result[mat] = 1));
    this.dependents.forEach(dep => dep.getMaturities().forEach(mat => result[mat] = 1));
    return Object.keys(result);
  }

  getNodeByName(nodeName: any) {
    if (this['name'] === nodeName) {
      return this;
    } else {
      let dep = this.dependents.find(d => d.name === nodeName);
      if (dep) {
          return dep;
      }
      dep = this.dependencies.find(d => d.name === nodeName);
      if (dep) {
        return dep;
      }
    }
  }
}
