import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YangShowNodeComponent } from './yang-show-node.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { YangShowNodeModalComponent } from './yang-show-node-modal/yang-show-node-modal.component';

@NgModule({
  declarations: [YangShowNodeComponent, YangShowNodeModalComponent],
  imports: [
    CommonModule,
    NgbAlertModule
  ]
})
export class YangShowNodeModule {
}
