import { Component, OnInit } from '@angular/core';
import { PtTopologyComponent, PtTopologyService } from '@pt/pt-topology';
import { ImpactVisService } from './impact-vis.service';
import { DataSet, Edge, Network, Node, IdType, Options } from 'vis';
import { ImpactVisNodeModel } from './models/impact-vis-node-model';


@Component({
  selector: 'yc-impact-analysis-visualisation',
  templateUrl: './impact-analysis-visualisation.component.html',
  styleUrls: ['./impact-analysis-visualisation.component.scss']
})
export class ImpactAnalysisVisualisationComponent extends PtTopologyComponent {
  private fullOpacity = '1';
  private dimmedOpacity = '0.1';


  constructor(impactVisService: ImpactVisService) {
    super(impactVisService);
  }

  cluster(opts) {
    this.visTopoObject.cluster(opts);
  }

  openCluster(nodeId) {
    this.visTopoObject.openCluster(nodeId, {
      releaseFunction: () => {
        return {};
      }
    });

  }

  redraw() {
    this.visTopoObject.stabilize();
  }

  undimAllNodes(orgColors, matColors) {
    this.topologyData.nodes.forEach((node: ImpactVisNodeModel) => {
      node['color']['background'] = orgColors[node.organization];
      if (node.maturity) {
        node['color']['border'] = matColors[node.maturity];
      }
    });
    this.updateNodes(this.topologyData.nodes);

    this.topologyData.links.forEach(link => {
      link['color'] = {
        color: 'rgba(0,0,0,1)'
      };
    });
    this.updateLinks(this.topologyData.links);
  }

  highlightNodes(nodesToBeHighlighted, orgColors, matColors) {
    const linksToBeDimmedIds = {};
    let linksToBeDimmed = [];
    let nodesToBeDimmed = [];

    const highlightNodesIds = nodesToBeHighlighted.map(node => node.id);
    nodesToBeDimmed = this.topologyData.nodes.filter(node => highlightNodesIds.indexOf(node.id) === -1);

    nodesToBeDimmed.forEach(node => {
      this.topologyData.links.filter(link => link.from === node.id || link.to === node.id).forEach(link => linksToBeDimmedIds[link.id] = 1);
    });

    nodesToBeDimmed.forEach((node: ImpactVisNodeModel) => {
      node['color']['background'] = orgColors[node.organization].replace(this.fullOpacity + ')', this.dimmedOpacity + ')');
      if (node.maturity) {
        node['color']['border'] = matColors[node.maturity].replace(this.fullOpacity + ')', this.dimmedOpacity + ')');
      }
    });
    this.updateNodes(nodesToBeDimmed);

    linksToBeDimmed = this.topologyData.links.filter(link => linksToBeDimmedIds.hasOwnProperty(link.id));
    linksToBeDimmed.forEach(link => {
      link['color'] = {
        color: 'rgba(0,0,0,' + this.dimmedOpacity + ')',
      };
    });
    this.updateLinks(linksToBeDimmed);

  }
}
