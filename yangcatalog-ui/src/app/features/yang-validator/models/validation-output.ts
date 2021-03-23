export class ValidationOutput {

  private modulesToValidate: string[] = [];
  /**
   * List of dependencies, for which there is more than one revision in repo and it is not clear, which revision should be used
   */
  private missing: any;
  /**
   * List of dependencies uploaded by user, for which there is more than one revision in repo and it is not clear, which revision should be used
   */
  private existing: any;
  private cache: string;
  public xym: any;
  public validationOutput = {};
  public warning = '';

  private privateProps = ['modules-to-validate', 'missing', 'cache', 'xym', 'dependencies', 'warning'];

  constructor(outputData: any) {
    this.modulesToValidate = outputData['modules-to-validate'];
    this.missing = outputData['dependencies'] ? outputData['dependencies']['missing'] || {} : null;
    this.existing = outputData['dependencies'] ? outputData['dependencies']['existing'] || {} : null;

    this.cache = outputData['cache'];

    if (outputData['xym']) {
      this.xym = outputData['xym'];
    }

    this.setValidationOutputData(outputData);
  }

  setValidationOutputData(outputData: any) {
    Object.keys(outputData).forEach(prop => {
      if (this.privateProps.indexOf(prop) === -1) {
        this.validationOutput[prop] = outputData[prop];
      }
    });
    this.warning = outputData['warning'];
  }

  isFinal(): boolean {
    return !(this.missing || this.existing);
  }

  getMissingDependenciesList() {
    return Object.keys(this.missing).sort((a: any, b: any) => {
      if (a > b) {
        return 1;
      } else {
        return -1;
      }
    });
  }

  getExistingDependenciesList() {
    return Object.keys(this.existing).sort((a: any, b: any) => {
      if (a > b) {
        return 1;
      } else {
        return -1;
      }
    });
  }

  getMissingRevisions(moduleName: string): string[] {
    return this.missing[moduleName].sort((a: any, b: any) => {
      if (a < b) {
        return 1;
      } else {
        return -1;
      }
    });
  }

  getExistingRepoRevisions(moduleName: string): string[] {
    return (
        this.existing[moduleName]['repo-dependencies']
          .sort((a: any, b: any) => {
            if (a < b) {
              return 1;
            } else {
              return -1;
            }
          })
      );
  }

  getExistingUploadedRevision(moduleName: string): string {
    return this.existing[moduleName]['user-dependencies'];
  }

  getModulesToValidate() {
    return this.modulesToValidate;
  }

  getCache() {
    return this.cache;
  }

  getValidatedModules() {
    return Object.keys(this.validationOutput);
  }

  getLatestMissingRevision(moduleName: string) {
    return this.getMissingRevisions(moduleName)[0];
  }

  getLatestExistingRevision(moduleName: string) {
    return [this.getExistingRepoRevisions(moduleName)[0]]
      .concat([this.getExistingUploadedRevision(moduleName)])
      .sort((a: any, b: any) => {
        if (a < b) {
          return 1;
        } else {
          return -1;
        }
      })[0];
  }
}
