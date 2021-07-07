import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImpactAnalysisModel } from '../models/impact-analysis-model';

@Component({
  selector: 'yc-cluster-context-menu',
  templateUrl: './cluster-context-menu.component.html',
  styleUrls: ['./cluster-context-menu.component.scss']
})
export class ClusterContextMenuComponent implements OnInit {

  @Input() clusterId: string;

  @Output() showNodes: EventEmitter<void> = new EventEmitter();
  loading = false;
  clusterName = '';


  constructor() { }

  ngOnInit(): void {
    this.clusterName = this.clusterId.replace('cluster_', '');
    this.clusterName = this.clusterName.replace('org_', '');
    this.clusterName = this.clusterName.replace('mat_', '');
  }

  onShowNodesClick() {
    this.loading = true;
    this.showNodes.emit();
  }
}
