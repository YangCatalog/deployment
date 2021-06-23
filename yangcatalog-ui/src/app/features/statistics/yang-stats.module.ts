import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YangStatsComponent } from './yang-stats.component';
import { CoreModule } from '../../core/core.module';
import { NgbAlertModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { BarChartModule, PieChartModule } from '@swimlane/ngx-charts';
import { AppAgGridModule } from '../../shared/ag-grid/app-ag-grid.module';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [YangStatsComponent],
  imports: [
    CommonModule,
    CoreModule,
    NgbNavModule,
    NgbAlertModule,
    BarChartModule,
    PieChartModule,
    AppAgGridModule,
    FormsModule,
    FontAwesomeModule
  ]
})
export class YangStatsModule { }
