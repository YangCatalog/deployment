import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadFormComponent } from './file-upload-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [FileUploadFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [FileUploadFormComponent]
})
export class FileUploadFormModule { }
