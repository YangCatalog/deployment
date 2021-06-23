import { Component } from '@angular/core';
import { YangShowNodeComponent } from '../yang-show-node.component';
import { ActivatedRoute } from '@angular/router';
import { YangSearchService } from '../../yang-search/yang-search.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'yc-yang-show-node-modal',
  templateUrl: './yang-show-node-modal.component.html',
  styleUrls: ['../yang-show-node.component.scss']
})
export class YangShowNodeModalComponent extends YangShowNodeComponent {

  constructor(
    protected route: ActivatedRoute,
    protected dataService: YangSearchService,
    protected modal: NgbActiveModal) {
    super(route, dataService);
  }

  isModal(): boolean {
    return true;
  }

  onCancelClick() {
    this.modal.close();
  }
}
