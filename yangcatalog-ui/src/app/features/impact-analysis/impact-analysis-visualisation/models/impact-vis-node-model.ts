import { ImageDetail, TopologyNode } from '@pt/pt-topology';
import { TopologyNodeDataModel } from '@pt/pt-topology/src/topology-interfaces/topology-node-data-model';

export class ImpactVisNodeModel implements TopologyNodeDataModel {

  group: string;
  id: string;
  label: string;
  organization: string;
  maturity: string;

  shape = 'dot';
  borderWidth = 2;
  borderWidthSelected = 20;
  size = 15;
  opacity = 0.3;

  isDependency: boolean;
  isDependent: boolean;


  margin = 0;
  font = {
    size: 10,
    vadjust: 0
  };


  constructor(id: string, label: string, organization: string, maturity: string, color: string, borderColor: string, isDependency: boolean, isDependent: boolean) {
    this.id = id;
    this.label = label;
    this.organization = organization;
    this.maturity = maturity;
    this['color'] = {
      background: color,
      border: borderColor,
      highlight: {
        background: color,
        border: borderColor
      }
    };
    this.isDependency = isDependency;
    this.isDependent = isDependent;



  }


}
