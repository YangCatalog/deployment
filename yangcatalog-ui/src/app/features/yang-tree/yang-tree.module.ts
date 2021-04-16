import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YangTreeComponent } from './yang-tree.component';
import { AppAgGridModule } from '../../shared/ag-grid/app-ag-grid.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CoreModule } from '../../core/core.module';
import { ClipboardModule } from 'ngx-clipboard';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [YangTreeComponent],
  imports: [
    CommonModule,
    AppAgGridModule,
    FontAwesomeModule,
    CoreModule,
    ClipboardModule,
    NgbAlertModule
  ]
})
export class YangTreeModule { }
