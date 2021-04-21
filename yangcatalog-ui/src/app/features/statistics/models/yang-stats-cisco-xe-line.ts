import { YangStatCiscoVersionPlatform } from './yang-stat-cisco-version-platform';

export class YangStatsCiscoXeLine {
  version: string;

  ASR920: YangStatCiscoVersionPlatform;
  C8000V: YangStatCiscoVersionPlatform;
  IR1101: YangStatCiscoVersionPlatform;
  ISR4000: YangStatCiscoVersionPlatform;
  NCS4200: YangStatCiscoVersionPlatform;
  cat9300: YangStatCiscoVersionPlatform;
  ESS3x00: YangStatCiscoVersionPlatform;
  C8200: YangStatCiscoVersionPlatform;
  CAT9400: YangStatCiscoVersionPlatform;
  CAT9500: YangStatCiscoVersionPlatform;
  cat3k: YangStatCiscoVersionPlatform;
  CSR1000V: YangStatCiscoVersionPlatform;
  CAT3650: YangStatCiscoVersionPlatform;
  C8500: YangStatCiscoVersionPlatform;
  CAT9600: YangStatCiscoVersionPlatform;
  cat9500: YangStatCiscoVersionPlatform;
  CAT9300: YangStatCiscoVersionPlatform;
  IE3x00: YangStatCiscoVersionPlatform;
  CAT9800: YangStatCiscoVersionPlatform;
  C8500L: YangStatCiscoVersionPlatform;
  CAT3850: YangStatCiscoVersionPlatform;
  ASR1000: YangStatCiscoVersionPlatform;
  C8300: YangStatCiscoVersionPlatform;
  'RSP2/RSP3': YangStatCiscoVersionPlatform;
  'CBR-8': YangStatCiscoVersionPlatform;
  CAT9200: YangStatCiscoVersionPlatform;
  ASR900: YangStatCiscoVersionPlatform;
  ISR1000: YangStatCiscoVersionPlatform;
  NCS520: YangStatCiscoVersionPlatform;


  constructor(version: string, data = {}) {
    this.version = version;

    this.ASR920 = new YangStatCiscoVersionPlatform(data['ASR920']);
    this.C8000V = new YangStatCiscoVersionPlatform(data['C8000V']);
    this.IR1101 = new YangStatCiscoVersionPlatform(data['IR1101']);
    this.ISR4000 = new YangStatCiscoVersionPlatform(data['ISR4000']);
    this.NCS4200 = new YangStatCiscoVersionPlatform(data['NCS4200']);
    this.cat9300 = new YangStatCiscoVersionPlatform(data['cat9300']);
    this.ESS3x00 = new YangStatCiscoVersionPlatform(data['ESS3x00']);
    this.C8200 = new YangStatCiscoVersionPlatform(data['C8200']);
    this.CAT9400 = new YangStatCiscoVersionPlatform(data['CAT9400']);
    this.CAT9500 = new YangStatCiscoVersionPlatform(data['CAT9500']);
    this.cat3k = new YangStatCiscoVersionPlatform(data['cat3k']);
    this.CSR1000V = new YangStatCiscoVersionPlatform(data['CSR1000V']);
    this.CAT3650 = new YangStatCiscoVersionPlatform(data['CAT3650']);
    this.C8500 = new YangStatCiscoVersionPlatform(data['C8500']);
    this.CAT9600 = new YangStatCiscoVersionPlatform(data['CAT9600']);
    this.cat9500 = new YangStatCiscoVersionPlatform(data['cat9500']);
    this.CAT9300 = new YangStatCiscoVersionPlatform(data['CAT9300']);
    this.IE3x00 = new YangStatCiscoVersionPlatform(data['IE3x00']);
    this.CAT9800 = new YangStatCiscoVersionPlatform(data['CAT9800']);
    this.C8500L = new YangStatCiscoVersionPlatform(data['C8500L']);
    this.CAT3850 = new YangStatCiscoVersionPlatform(data['CAT3850']);
    this.ASR1000 = new YangStatCiscoVersionPlatform(data['ASR1000']);
    this.C8300 = new YangStatCiscoVersionPlatform(data['C8300']);
    this['RSP2/RSP3'] = new YangStatCiscoVersionPlatform(data['RSP2/RSP3']);
    this['CBR-8'] = new YangStatCiscoVersionPlatform(data['CBR-8']);
    this.CAT9200 = new YangStatCiscoVersionPlatform(data['CAT9200']);
    this.ASR900 = new YangStatCiscoVersionPlatform(data['ASR900']);
    this.ISR1000 = new YangStatCiscoVersionPlatform(data['ISR1000']);
    this.NCS520 = new YangStatCiscoVersionPlatform(data['NCS520']);




  }
}
