import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YangValidatorComponent } from './yang-validator.component';
import { NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YangValidatorService } from './yang-validator.service';

@NgModule({
  declarations: [YangValidatorComponent],
  providers: [
    YangValidatorService
  ],
  imports: [
    CommonModule,
    NgbTabsetModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class YangValidatorModule {
}
