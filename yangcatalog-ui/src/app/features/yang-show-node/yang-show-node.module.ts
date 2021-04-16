import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YangShowNodeComponent } from './yang-show-node.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [YangShowNodeComponent],
  imports: [
    CommonModule,
    NgbAlertModule
  ]
})
export class YangShowNodeModule {
}
