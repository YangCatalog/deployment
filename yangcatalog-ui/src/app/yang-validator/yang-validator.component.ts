import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { DataServiceService } from '../core/data-service.service';
import { YangValidatorService } from './yang-validator.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'yc-yang-validator',
  templateUrl: './yang-validator.component.html',
  styleUrls: ['./yang-validator.component.scss']
})
export class YangValidatorComponent implements OnInit, OnDestroy {

  @ViewChild('attachmentFileInput', {static: true}) attachmentFileInput: ElementRef;


  rfcNumberForm: FormGroup;
  rfcNameForm: FormGroup;
  rfcFilesForm: FormGroup;

  displayTooManyFilesErrorMsg: boolean;
  displayNotValidFileSize: boolean;
  displayNotValidFileType: boolean;

  attachments = [];


  allowedFileTypesString = [
    '.txt', '.zip', '.jpg'
  ];
  rfcNumberValidation = false;
  validadtingRfcNumberProgress = false;
  private componentDestroyed: Subject<void> = new Subject<void>();


  constructor(
    private formBuilder: FormBuilder,
    private dataService: YangValidatorService
  ) {
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
  }



  ngOnInit() {
    this.rfcNumberForm = this.formBuilder.group({
      rfcNumber: ['', Validators.required]
    });

    this.rfcNameForm = this.formBuilder.group({
      rfcName: ['', Validators.required]
    });

    this.rfcFilesForm = this.formBuilder.group({
      attachments: this.formBuilder.array([]),
    });
    this.rfcFilesForm.get('attachments').valueChanges.subscribe(() => this.attachmentFormArrayChanged());
  }

  openAttachFileDialog() {
    this.attachmentFileInput.nativeElement.click();

  }

  onFileChangeHandler($event: Event) {
    this.onFileInputChange($event);
    this.attachmentFileInput.nativeElement.value = '';
  }

  public formatFileSize(sizeInBytes: string, decimals?: number) {
    const size: number = parseInt(sizeInBytes, 10);
    if (size === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }


  public covertFileListToAttachmentVM(files: FileList): any[] {
    const result = [];

    if (files.length > 0) {
      Object.keys(files).forEach(i => {
        const currentFile: File = files[i];
        const displayFileSize = this.formatFileSize(currentFile.size.toString());
        result.push(
          {
            name: currentFile.name,
            type: currentFile.type,
            size: currentFile.size.toString(),
            displayFileSize
          }
        );
      });
    }

    return result;
  }


  private attachmentFormArrayChanged() {
    const files = this.rfcFilesForm.get('attachments').value.map(val => val.file);
    this.attachments = this.covertFileListToAttachmentVM(files);

    // displaying error message for max amount of filess
    this.displayTooManyFilesErrorMsg = !this.validateFilesCount(this.attachments.length, 10);
    // displaying error message for one or more files exceeded 2MB
    this.displayNotValidFileSize = !this.validateFilesSize(this.attachments, 2097152);
    // displaying error message for one or more files type is not allowed
    this.displayNotValidFileType = !this.validateFilesType(this.attachments, this.allowedFileTypesString);
  }

  public validateFileType(fileName: string, allowedFileTypes: string[]): boolean {
    const suffixIndex = fileName.lastIndexOf('.');
    const fileSuffix = fileName.slice(suffixIndex);
    return suffixIndex > 0 && allowedFileTypes.indexOf(fileSuffix) > -1;
  }


  public removeAttachmentFromFormArray(attachmentToRemove: any, attachmentFormArray: FormArray) {
    const indexToRemove: number[] = [];
    attachmentFormArray.controls.forEach((attach, index) => {
      if (
        attach.value.file.name === attachmentToRemove.name &&
        attach.value.file.size === parseInt(attachmentToRemove.fileSize, 10)
      ) {
        indexToRemove.push(index);
      }
    });
    indexToRemove.forEach(i => attachmentFormArray.removeAt(i));
  }


  onDeleteAttachment(attachmentsToRemove: any) {
    this.removeAttachmentFromFormArray(attachmentsToRemove, this.rfcFilesForm.get('attachments') as FormArray);
  }


  public validateFilesType(attachments: any[], allowedFileTypes: string[]) {
    let isValid = true;
    attachments.forEach(attachment => {
      if (!this.validateFileType(attachment.name, allowedFileTypes)) {
        isValid = false;
        return;
      }
    });
    return isValid;
  }


  public validateFilesCount(totalAttachmentsCount: number, maxFilesToUpload: number) {
    return totalAttachmentsCount <= maxFilesToUpload;
  }

  public validateFileSize(size: string, maxBytesToUpload: number): boolean {
    // 2MB = 2097152 Bytes
    if (parseInt(size, 10) > maxBytesToUpload) {
      return false;
    }
    return true;
  }


  public validateFilesSize(attachments: any[], maxBytesToUpload: number) {
    let isValid = true;
    attachments.forEach(attachment => {
      if (!this.validateFileSize(attachment.fileSize, maxBytesToUpload)) {
        isValid = false;
        return;
      }
    });
    return isValid;
  }



  private onFileInputChange(event: Event) {
    this.handleFileInputChangeWithFileContent(event, this.rfcFilesForm, 'attachments');

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
    // add to file group only new files


    if (fileIndex === -1) {
      // fileValue['uuid'] = UUID.UUID();
      fileValue.content = fileContent;
      const fileFormGroup = this.formBuilder.group({
        file: fileValue
      });

      attachmentsFormArray.push(fileFormGroup);
      attachmentsFormArray.markAsTouched();
      console.log('attachmentsFormArray', attachmentsFormArray);
    }
  }


  showRfcNumberForm() {
    this.rfcNumberValidation = true;
  }

  noFormDisplayed() {
    return !(this.rfcNumberValidation);
  }

  resetValidation() {
    this.rfcNumberValidation = false;
  }

  validateRfcNumber() {
    this.validadtingRfcNumberProgress = true;
    this.dataService.testGet()
      .pipe(
        takeUntil(this.componentDestroyed)
      )
      .subscribe(
      res => {
        console.log('res', res);
      },
      err => {
        console.error(err);
      }
    );
  }
}
