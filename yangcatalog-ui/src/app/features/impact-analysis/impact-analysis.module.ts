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
import { ClusterContextMenuComponent } from './impact-analysis-visualisation/cluster-context-menu/cluster-context-menu.component';
import { ImpactNodesListComponent } from './impact-analysis-visualisation/impact-nodes-list/impact-nodes-list.component';
import { AppAgGridModule } from '../../shared/ag-grid/app-ag-grid.module';
import { ImpactWarningsComponent } from './impact-analysis-visualisation/impact-warnings/impact-warnings.component';



@NgModule({
  declarations: [ImpactAnalysisComponent, ImpactAnalysisVisualisationComponent, NodeContextMenuComponent, ClusterContextMenuComponent, ImpactNodesListComponent, ImpactWarningsComponent],
  entryComponents: [ImpactNodesListComponent, ImpactWarningsComponent],
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
    CoreModule,
    AppAgGridModule

  ]
})
export class ImpactAnalysisModule { }
