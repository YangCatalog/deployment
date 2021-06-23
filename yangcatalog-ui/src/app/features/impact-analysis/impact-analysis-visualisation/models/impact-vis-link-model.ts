import { TopologyEdgeDataModel } from '@pt/pt-topology';

export class ImpactVisLinkModel implements TopologyEdgeDataModel {
  from: string;
  id: string;
  to: string;

  color = {};

  arrows = {};


  constructor(id: string, from: string, to: string, color: string, arrowType: string) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.color = {
      color
    };

    this['arrows'] = {};
    if (arrowType === 'from' || arrowType === 'both') {
      this.arrows['from'] = {
        enabled: true
      };
    }
    if (arrowType === 'to' || arrowType === 'both') {
      this.arrows['to'] = {
        enabled: true,
      };
    }

  }

}
