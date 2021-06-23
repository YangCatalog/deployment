import { EventEmitter, Injectable } from '@angular/core';
import { PtTopologyService } from '@pt/pt-topology';
import { DataSet, Edge, Network, Node, IdType, Options } from 'vis';

@Injectable({
  providedIn: 'root'
})
export class ImpactVisService extends PtTopologyService {

  constructor() {
    super();
  }


  createTopology(domContainerId: string, visOptions, instanceNameInGlobalScope?: string): Network {
    // create a network
    const container = document.getElementById(domContainerId);
    const visInstance = new Network(container, {}, visOptions);

    if (instanceNameInGlobalScope) {
      window[instanceNameInGlobalScope] = visInstance;
    }

    this.disableCanvasContextMenu(this.getCanvasObject(domContainerId));

    return visInstance;
  }


  setTopologyClickEvents(visTopoObject: Network,
                         clickNodeEmitter: EventEmitter<IdType>,
                         clickLinkEmitter: EventEmitter<any>,
                         clickCanvas: EventEmitter<any>
  ): void {
    this.setTopologyEvent(
      visTopoObject,
      'click',
      params => {
        const clickedNode = visTopoObject.getNodeAt(params.pointer.DOM);
        if (clickedNode) {
          clickNodeEmitter.emit(params);
        } else if (params.edges.length) {
          clickLinkEmitter.emit({ linkId: params.edges[0], nodeIds: visTopoObject.getConnectedNodes(params.edges[0]) });
        } else {
          clickCanvas.emit();
        }
      });
  }

}
