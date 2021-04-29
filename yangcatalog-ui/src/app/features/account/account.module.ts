import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account/account.component';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgbAlertModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [AccountComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgBootstrapFormValidationModule,
    NgbAlertModule
  ]
})
export class AccountModule { }
