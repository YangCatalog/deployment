import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YangSearchComponent } from './yang-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AppAgGridModule } from '../../shared/ag-grid/app-ag-grid.module';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [YangSearchComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbAlertModule,
        NgbNavModule,
        AppAgGridModule,
        NgbTooltipModule,
        CoreModule
    ]
})
export class YangSearchModule { }
