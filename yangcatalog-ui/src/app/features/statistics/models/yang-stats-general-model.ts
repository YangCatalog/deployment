export class YangStatsGeneralModel {
  currentDate: number;
  numParsedFiles: number;
  numUniqueParsedFiles: number;
  numYangFilesStandard: number;
  numYangFilesStandardNdp: number;
  numYangFilesVendor: number;
  numYangFilesVendorNdp: number;


  constructor(data = {}) {
    this.currentDate = data['current_date'];
    this.numParsedFiles = data['num_parsed_files'];
    this.numUniqueParsedFiles = data['num_unique_parsed_files'];
    this.numYangFilesStandard = data['num_yang_files_standard'];
    this.numYangFilesStandardNdp = data['num_yang_files_standard_ndp'];
    this.numYangFilesVendor = data['num_yang_files_vendor'];
    this.numYangFilesVendorNdp = data['num_yang_files_vendor_ndp'];
  }
}
