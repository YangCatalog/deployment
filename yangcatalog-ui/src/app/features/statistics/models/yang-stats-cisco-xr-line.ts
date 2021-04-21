import { YangStatCiscoVersionPlatform } from './yang-stat-cisco-version-platform';

export class YangStatsCiscoXrLine {
  version: string;
  ncs1001: YangStatCiscoVersionPlatform;
  ncs540l: YangStatCiscoVersionPlatform;
  _8000: YangStatCiscoVersionPlatform;
  iosxrvX64: YangStatCiscoVersionPlatform;
  ncs1k: YangStatCiscoVersionPlatform;
  ncs2k: YangStatCiscoVersionPlatform;
  iosxrwbd: YangStatCiscoVersionPlatform;
  ncs560: YangStatCiscoVersionPlatform;
  ncs5500: YangStatCiscoVersionPlatform;
  hfrPx: YangStatCiscoVersionPlatform;
  xrv9k: YangStatCiscoVersionPlatform;
  ncs5k: YangStatCiscoVersionPlatform;
  asr9KPx: YangStatCiscoVersionPlatform;
  asr9KX64: YangStatCiscoVersionPlatform;
  ncs1004: YangStatCiscoVersionPlatform;
  ncs540: YangStatCiscoVersionPlatform;
  xrvr: YangStatCiscoVersionPlatform;
  ncs6k: YangStatCiscoVersionPlatform;
  ncs5700: YangStatCiscoVersionPlatform;

  constructor(version: string, data = {}) {
    this.version = version;
    this.ncs1001 = new YangStatCiscoVersionPlatform(data['ncs1001']);
    this.ncs540l = new YangStatCiscoVersionPlatform(data['ncs540l']);
    this._8000 = new YangStatCiscoVersionPlatform(data['8000']);
    this.iosxrvX64 = new YangStatCiscoVersionPlatform(data['iosxrv-x64']);
    this.ncs1k = new YangStatCiscoVersionPlatform(data['ncs1k']);
    this.ncs2k = new YangStatCiscoVersionPlatform(data['ncs2k']);
    this.iosxrwbd = new YangStatCiscoVersionPlatform(data['iosxrwbd']);
    this.ncs560 = new YangStatCiscoVersionPlatform(data['ncs560']);
    this.ncs5500 = new YangStatCiscoVersionPlatform(data['ncs5500']);
    this.hfrPx = new YangStatCiscoVersionPlatform(data['hfr-px']);
    this.xrv9k = new YangStatCiscoVersionPlatform(data['xrv9k']);
    this.ncs5k = new YangStatCiscoVersionPlatform(data['ncs5k']);
    this.asr9KPx = new YangStatCiscoVersionPlatform(data['asr9k-px']);
    this.asr9KX64 = new YangStatCiscoVersionPlatform(data['asr9k-x64']);
    this.ncs1004 = new YangStatCiscoVersionPlatform(data['ncs1004']);
    this.ncs540 = new YangStatCiscoVersionPlatform(data['ncs540']);
    this.xrvr = new YangStatCiscoVersionPlatform(data['xrvr']);
    this.ncs6k = new YangStatCiscoVersionPlatform(data['ncs6k']);
    this.ncs5700 = new YangStatCiscoVersionPlatform(data['ncs5700']);
  }
}
