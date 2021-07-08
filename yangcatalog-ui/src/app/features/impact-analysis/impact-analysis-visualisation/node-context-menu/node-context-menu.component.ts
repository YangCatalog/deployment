import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImpactVisNodeModel } from '../models/impact-vis-node-model';
import { ImpactAnalysisModel } from '../models/impact-analysis-model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'yc-node-context-menu',
  templateUrl: './node-context-menu.component.html',
  styleUrls: ['./node-context-menu.component.scss']
})
export class NodeContextMenuComponent implements OnInit {

  @Input() node: ImpactAnalysisModel;

  @Output() loadMore: EventEmitter<void> = new EventEmitter();

  myBaseUrl = environment.WEBROOT_BASE_URL;

  constructor() { }

  ngOnInit(): void {
  }


  onStartImpactAnalysis() {

  }
}
