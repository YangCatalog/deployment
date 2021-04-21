export class YangStatCiscoVersionPlatform {
  github: boolean;
  yangcatalog: boolean;

  constructor(data = {}) {
    this.github = data['github'];
    this.yangcatalog = data['yangcatalog'];
  }
}
