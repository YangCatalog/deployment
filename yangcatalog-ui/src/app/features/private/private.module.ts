import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateComponent } from './private.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { LightboxModule } from 'ngx-lightbox';
import { AppAgGridModule } from '../../shared/ag-grid/app-ag-grid.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PieChartModule } from '@swimlane/ngx-charts';



@NgModule({
  declarations: [PrivateComponent],
    imports: [
        CommonModule,
        NgbNavModule,
        LightboxModule,
        AppAgGridModule,
        RouterModule,
        FormsModule,
        PieChartModule
    ]
})
export class PrivateModule { }
