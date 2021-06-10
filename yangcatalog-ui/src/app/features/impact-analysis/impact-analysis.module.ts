import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpactAnalysisComponent } from './impact-analysis.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbNavModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { TagInputModule } from 'ngx-chips';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [ImpactAnalysisComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbNavModule,
    TagInputModule,
    NgbTypeaheadModule,
    RouterModule

  ]
})
export class ImpactAnalysisModule { }
