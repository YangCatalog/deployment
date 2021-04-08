import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YangRegexValidatorComponent } from './yang-regex-validator.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { YangRegexAboutComponent } from './yang-regex-about/yang-regex-about.component';

@NgModule({
  declarations: [YangRegexValidatorComponent, YangRegexAboutComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgbTooltipModule,
        NgBootstrapFormValidationModule,
        NgbAlertModule
    ]
})
export class YangRegexValidatorModule { }
