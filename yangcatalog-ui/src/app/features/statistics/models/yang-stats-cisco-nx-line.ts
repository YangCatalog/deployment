import { YangStatCiscoVersionPlatform } from './yang-stat-cisco-version-platform';

export class YangStatsCiscoNxLine {
  version: string;
  nexus9000: YangStatCiscoVersionPlatform;
  nexus3000: YangStatCiscoVersionPlatform;

  constructor(version: string, data = {}) {
    this.version = version;
    this.nexus9000 = new YangStatCiscoVersionPlatform(data['Nexus 9000']);
    this.nexus3000 = new YangStatCiscoVersionPlatform(data['Nexus 3000']);
  }
}
