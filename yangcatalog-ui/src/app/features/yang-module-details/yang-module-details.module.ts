import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YangModuleDetailsComponent } from './yang-module-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../../core/core.module';


@NgModule({
  declarations: [YangModuleDetailsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbAlertModule,
    NgbTypeaheadModule,
    NgBootstrapFormValidationModule,
    NgbTooltipModule,
    RouterModule,
    CoreModule,

  ]
})
export class YangModuleDetailsModule { }
