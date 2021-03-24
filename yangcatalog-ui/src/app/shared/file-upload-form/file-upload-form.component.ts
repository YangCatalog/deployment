import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { FilesService } from '../../core/files.service';

@Component({
  selector: 'yc-file-upload-form',
  templateUrl: './file-upload-form.component.html',
  styleUrls: ['./file-upload-form.component.scss']
})
export class FileUploadFormComponent implements OnInit {
  @Input() filesPropertyName: string;
  @Input() allowedFileTypes = ['*'];
  @Input() multipleFiles = true;

  @Output() selection: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('attachmentFileInput', {static: true}) attachmentFileInput: ElementRef;
  @ViewChild('attachmentFileInputMultiple', {static: true}) attachmentFileInputMultiple: ElementRef;

  form: FormGroup;

  attachments = [];


  constructor(
    private formBuilder: FormBuilder,
    private fileService: FilesService
  ) { }


  ngOnInit(): void {
    this.initForm();
    this.attachmentFileInput = this.multipleFiles ? this.attachmentFileInputMultiple : this.attachmentFileInput;
  }

  private initForm() {
    this.form = this.formBuilder.group({});
    this.form.addControl(this.filesPropertyName, this.formBuilder.array([]));
    this.form.get(this.filesPropertyName).valueChanges.subscribe(() => this.attachmentFormArrayChanged());
  }

  openAttachFileDialog() {
    this.attachmentFileInput.nativeElement.click();
  }

  onFileChangeHandler(event: Event) {
    this.handleFileInputChangeWithFileContent(event, this.form, this.filesPropertyName);
    this.attachmentFileInput.nativeElement.value = '';
  }

  public covertFileListToAttachments(files: FileList): any[] {
    const result = [];

    if (files.length > 0) {
      Object.keys(files).forEach(i => {
        const currentFile: File = files[i];
        const displayFileSize = this.fileService.formatFileSize(currentFile.size.toString());
        result.push(
          {
            name: currentFile.name,
            displayFileSize
          }
        );
      });
    }

    return result;
  }


  private attachmentFormArrayChanged() {
    const files = this.form.get(this.filesPropertyName).value.map(val => val.file);
    this.attachments = this.covertFileListToAttachments(files);
  }

  onDeleteAttachment(index: number) {
    (this.form.get(this.filesPropertyName) as FormArray).removeAt(index);
  }


  public handleFileInputChangeWithFileContent(event: any, form: any, attachmentControlName: any) {
    const filesList: FileList = event.target.files;
    const filesCount = filesList.length;

    if (filesCount > 0) {
      Object.keys(filesList).forEach(i => {
        const reader = new FileReader();
        const currentFile = filesList[i];
        reader.readAsDataURL(currentFile);

        reader.onload = () => {
          const fileContent = (reader.result as string).split(',')[1];
          this.addFileAndContentToForm(currentFile, fileContent, form, attachmentControlName);
          this.selection.emit();
        };
      });
    }
  }

  private addFileAndContentToForm(fileValue: any, fileContent: any, form: any, attachmentControlName: any) {
    const attachmentsFormArray: FormArray = form.get(attachmentControlName) as FormArray;
    const fileIndex = _.findIndex(attachmentsFormArray.controls, attachmentControl => {
      return (
        attachmentControl.value.file.name === fileValue.name &&
        attachmentControl.value.file.size === fileValue.size
      );
    });



    if (fileIndex === -1) {
      fileValue.content = fileContent;
      const fileFormGroup = this.formBuilder.group({
        file: fileValue
      });


      if (attachmentsFormArray.length > 0 && !this.multipleFiles) {
        attachmentsFormArray.clear();
      }
      attachmentsFormArray.push(fileFormGroup);
      attachmentsFormArray.markAsTouched();
    }
  }
}
