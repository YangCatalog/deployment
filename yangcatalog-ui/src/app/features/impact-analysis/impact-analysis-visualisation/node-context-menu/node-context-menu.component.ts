import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImpactVisNodeModel } from '../models/impact-vis-node-model';
import { ImpactAnalysisModel } from '../models/impact-analysis-model';

@Component({
  selector: 'yc-node-context-menu',
  templateUrl: './node-context-menu.component.html',
  styleUrls: ['./node-context-menu.component.scss']
})
export class NodeContextMenuComponent implements OnInit {

  @Input() node: ImpactAnalysisModel;

  @Output() loadMore: EventEmitter<void> = new EventEmitter();
  loading = false;


  constructor() { }

  ngOnInit(): void {
  }

  onLoadMoreClick() {
    this.loading = true;
    this.loadMore.emit();
  }
}
