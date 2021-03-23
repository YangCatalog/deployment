import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YangValidatorComponent } from './yang-validator.component';
import { NgbAccordionModule, NgbAlertModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YangValidatorService } from './yang-validator.service';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { MissingModulesSelectionComponent } from './missing-modules-confirmation/missing-modules-selection.component';
import { ValidationResultComponent } from './validation-result/validation-result.component';
import { ValidationErrorComponent } from './validation-error/validation-error.component';
import { AppModule } from '../../app.module';
import { FileUploadFormModule } from '../../shared/file-upload-form/file-upload-form.module';

@NgModule({
  declarations: [YangValidatorComponent, MissingModulesSelectionComponent, ValidationResultComponent, ValidationErrorComponent],
  providers: [
    YangValidatorService
  ],
  imports: [
    CommonModule,
    NgbTabsetModule,
    ReactiveFormsModule,
    FormsModule,
    NgBootstrapFormValidationModule,
    NgbAccordionModule,
    NgbAlertModule,
    FileUploadFormModule
  ]
})
export class YangValidatorModule {
}
