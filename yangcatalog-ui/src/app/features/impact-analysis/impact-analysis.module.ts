import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpactAnalysisComponent } from './impact-analysis.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbNavModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { RouterModule } from '@angular/router';
import { ImpactAnalysisVisualisationComponent } from './impact-analysis-visualisation/impact-analysis-visualisation.component';
import { ClusteringService, PtTopologyService } from '@pt/pt-topology';
import { CoreModule } from '../../core/core.module';
import { NodeContextMenuComponent } from './impact-analysis-visualisation/node-context-menu/node-context-menu.component';



@NgModule({
  declarations: [ImpactAnalysisComponent, ImpactAnalysisVisualisationComponent, NodeContextMenuComponent],
  providers: [PtTopologyService, ClusteringService],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbAlertModule,
        NgbNavModule,
        TagInputModule,
        NgbTypeaheadModule,
        RouterModule,
        CoreModule

    ]
})
export class ImpactAnalysisModule { }
