import { isArray } from 'rxjs/internal-compatibility';

export class ModuleInfoMetaDataModel {

  metaData: any;

  constructor(metaData) {
    this.metaData = metaData;

    if (this.metaData['implementations'] && this.metaData['implementations']['implementation']) {
      this.metaData['implementations']['implementation']['ordering'] = this.metaData['implementations']['ordering'];
      this.metaData['implementations']['implementation']['help-text'] = this.metaData['implementations']['help-text'];
      this.metaData['implementations'] = this.metaData['implementations']['implementation'];
    }
  }

  getPropertiesSorted(propertiesContainer: any): string[] {
    const clearedPropsList = Object.keys(propertiesContainer).filter(item => ['help-text', 'ordering'].indexOf(item) === -1);

    return clearedPropsList
      .sort((a: any, b: any) => {
      if (propertiesContainer[a]['ordering'] > propertiesContainer[b]['ordering']) {
        return 1;
      } else {
        return -1;
      }
    });
  }

  getPropertyHelpText(property: string | string[]): string {
    let result = '';
    if (isArray(property)) {
      let propertObj = this.metaData;
      property.forEach(propertyName => {propertObj = propertObj[propertyName];});
      result = propertObj['help-text'];
    } else {
      result = this.metaData[property]['help-text'];
    }
    return result.replace(/<br\s*\/?>/gi, ' ');
  }
}
