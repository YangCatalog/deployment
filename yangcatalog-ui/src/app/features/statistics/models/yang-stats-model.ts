import { YangStatsGeneralModel } from './yang-stats-general-model';
import { YangStatsContribsLine } from './yang-stats-contribs-line';
import { YangStatsCiscoNxLine } from './yang-stats-cisco-nx-line';
import { YangStatsCiscoXrLine } from './yang-stats-cisco-xr-line';
import { YangStatsCiscoXeLine } from './yang-stats-cisco-xe-line';

export class YangStatsModel {
  general: YangStatsGeneralModel;
  sdoContribs: YangStatsContribsLine[];
  vendorContribs: YangStatsContribsLine[];

  ciscoNx: YangStatsCiscoNxLine[];
  ciscoXr: YangStatsCiscoXrLine[];
  ciscoXe: YangStatsCiscoXeLine[];


  constructor(data = {}) {
    this.general = new YangStatsGeneralModel(data);
    this.sdoContribs = data['table_sdo'].map(contrib => new YangStatsContribsLine(contrib));
    this.vendorContribs = data['table_vendor'].map(contrib => new YangStatsContribsLine(contrib));

    if (data['nx']) {
      this.ciscoNx = Object.keys(data['nx']).map(key => new YangStatsCiscoNxLine(key, data['nx'][key]));
    }
    if (data['xr']) {
      this.ciscoXr = Object.keys(data['xr']).map(key => new YangStatsCiscoXrLine(key, data['xr'][key]));
    }
    if (data['xe']) {
      this.ciscoXe = Object.keys(data['xe']).map(key => new YangStatsCiscoXeLine(key, data['xe'][key]));
    }

  }

  getSdoToVendorSums() {
    return [
      {name: 'SDO and Opensource', value: this.getSdoGuthubSum()},
      {name: 'Vendor', value: this.getVendorGithubSum()}
    ];
  }

  private getVendorGithubSum(): number {
    let result = 0;
    this.vendorContribs.forEach((vc: YangStatsContribsLine) => result += vc.numGithub);
    return result;
  }



  private getSdoGuthubSum(): number {
    let result = 0;
    this.sdoContribs.forEach((vc: YangStatsContribsLine) => result += vc.numGithub);
    return result;
  }

  getVendorGithubNumbers() {
    return this.vendorContribs.map((vc: YangStatsContribsLine) => {
      return {name: vc.name, value: vc.numGithub};
    });

  }

  getSdoGighubNumbers() {
    const result = [];
    const groups = {};
    this.sdoContribs.forEach((sdoc: YangStatsContribsLine) => {
      const nameArr = sdoc.name.split(' ');
      if (groups.hasOwnProperty(nameArr[0])) {
        groups[nameArr[0]] += sdoc.numGithub;
      } else {
        groups[nameArr[0]] = sdoc.numGithub;
      }
    });
    Object.keys(groups).forEach(group => {
      result.push({name: group, value: groups[group]});
    });
    return result;
  }


}
