import { ValidationOutput } from './validation-output';

export class ChosenMissingRevsInput {

  'modules-to-validate': any;
  cache: string;
  dependencies: {
    'repo-modules': string[]
  } = { 'repo-modules': []};


  constructor(previousPartialOutput: ValidationOutput) {
    this['modules-to-validate'] = previousPartialOutput.getModulesToValidate();
    this.cache = previousPartialOutput.getCache();
    this.dependencies = {'repo-modules': []};
  }

  setDependencyRepoRevision(moduleName: string, revision: string) {
    this.dependencies['repo-modules'].push(moduleName + '@' + revision + '.yang');
  }

  setDependencyUserRevision(moduleName: string, revision: string) {
    // this is redundant due to backend inner business logic
    // this.dependencies['user-modules'].push(moduleName + '@' + revision + '.yang');
  }
}
