import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { YangValidatorService } from './yang-validator.service';
import { finalize, mergeMap, takeUntil } from 'rxjs/operators';
import { merge, Subject } from 'rxjs';
import { ValidationOutput } from './models/validation-output';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MissingModulesSelectionComponent } from './missing-modules-confirmation/missing-modules-selection.component';
import { ChosenMissingRevsInput } from './models/chosen-missing-revs-input';
import { FileUploadFormComponent } from '../../shared/file-upload-form/file-upload-form.component';
import { YcValidationsService } from '../../core/yc-validations.service';
import { ErrorMessage } from 'ng-bootstrap-form-validation';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ValidationResultComponent } from './validation-result/validation-result.component';


@Component({
  selector: 'yc-yang-validator',
  templateUrl: './yang-validator.component.html',
  styleUrls: ['./yang-validator.component.scss']
})
export class YangValidatorComponent implements OnInit, OnDestroy {
  @ViewChild('filesForm') filesForm: FileUploadFormComponent;
  @ViewChild('draftFileForm') draftFileForm: FileUploadFormComponent;
  @ViewChild('validationResults') validationResults: ElementRef;

  myBaseUrl = environment.WEBROOT_BASE_URL;

  rfcNumberForm: FormGroup;
  draftNameForm: FormGroup;
  rfcNameForm: FormGroup;

  rfcNumberValidation = true;
  draftNameValidation = true;
  filesValidation = true;
  draftFileValidation = true;
  apiOverview = false;

  activeForm = '';

  validatingRfcNumberProgress = false;
  validatingDraftNameProgress = false;
  validatingFilesProgress = false;
  validatingDraftFileProgress = false;

  validationOutput: ValidationOutput;
  error: any;

  customErrorMessages: ErrorMessage[] = [
    {
      error: 'notNumber',
      format: (label, error) => `${label} has to be a number`
    }
  ];


  private componentDestroyed: Subject<void> = new Subject<void>();
  private formTypeChanged: Subject<void> = new Subject<void>();


  constructor(
    private formBuilder: FormBuilder,
    private dataService: YangValidatorService,
    private modalService: NgbModal,
    private ycValidations: YcValidationsService,
    private route: ActivatedRoute
  ) {
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
  }


  ngOnInit() {
    this.initRfcNumberForm();

    this.initDraftNameForm();

    this.rfcNameForm = this.formBuilder.group({
      rfcName: ['', Validators.required]
    });

    this.subscribeRouteParams();

  }


  private initDraftNameForm() {
    this.draftNameForm = this.formBuilder.group({
      draftName: ['', Validators.required]
    });
  }

  private initRfcNumberForm() {
    this.rfcNumberForm = this.formBuilder.group({
      rfcNumber: ['', [Validators.required, this.ycValidations.getNumberValidation()]]
    });
  }

  showRfcNumberForm() {
    this.error = null;
    this.formTypeChanged.next();
    this.rfcNumberValidation = true;
    this.initRfcNumberForm();
  }

  showFilesForm() {
    this.error = null;
    this.formTypeChanged.next();
    this.filesValidation = true;
  }

  showDraftFileForm() {
    this.error = null;
    this.formTypeChanged.next();
    this.draftFileValidation = true;
  }

  showDraftNameForm() {
    this.draftNameValidation = true;
    this.error = null;
    this.formTypeChanged.next();
    this.initDraftNameForm();
  }

  showApiOverview() {
    this.apiOverview = true;
    this.error = null;
    this.formTypeChanged.next();
  }

  noFormDisplayed() {
    return !(this.rfcNumberValidation || this.draftNameValidation || this.filesValidation || this.draftFileValidation || this.apiOverview);
  }

  resetValidation() {
    this.formTypeChanged.next();
    this.rfcNumberValidation = false;
    this.draftNameValidation = false;
    this.filesValidation = false;
    this.draftFileValidation = false;
    this.apiOverview = false;
    this.validationOutput = null;
  }

  validateRfcNumber() {
    if (this.rfcNumberForm.invalid || this.validatingRfcNumberProgress) {
      return;
    }

    this.validatingRfcNumberProgress = true;
    this.validationOutput = null;
    this.error = null;

    this.dataService.validateRfcByNumber(this.rfcNumberForm.get('rfcNumber').value)
      .pipe(
        finalize(() => this.validatingRfcNumberProgress = false),
        takeUntil(merge(this.formTypeChanged, this.componentDestroyed))
      )
      .subscribe(
        (output: ValidationOutput) => {
          if (output.isFinal()) {
            this.validationOutput = output;
            this.scrollToResults();
          } else {
            const modalRef: NgbModalRef = this.modalService.open(MissingModulesSelectionComponent);
            const modalComponent: MissingModulesSelectionComponent = modalRef.componentInstance;
            modalComponent.validationOutput = output;

            modalRef.result.then(
              (choosedRevisionsInput: ChosenMissingRevsInput) => {
                this.validatingRfcNumberProgress = true;

                if (choosedRevisionsInput !== null) {
                  this.dataService.chooseMissingRevsForPreviousRequest(output, choosedRevisionsInput)
                    .pipe(
                      finalize(() => this.validatingRfcNumberProgress = false),
                      takeUntil(this.componentDestroyed)
                    ).subscribe(
                    () => {
                      this.validationOutput = output;
                      this.scrollToResults();
                    },
                    err => this.error = err
                  );
                } else {
                  this.dataService.validateRfcByNumberWithLatestRevisions(this.rfcNumberForm.get('rfcNumber').value)
                    .pipe(
                      finalize(() => this.validatingRfcNumberProgress = false),
                      takeUntil(this.componentDestroyed)
                    )
                    .subscribe(
                      output2 => {
                        this.validationOutput = output2;
                        this.scrollToResults();
                      },
                      err => this.error = err
                    );
                }
              },
              () => {
              }
            );
          }
        },
        err => {
          console.error(err);
          this.error = err;
        }
      );
  }

  validateDraftName() {
    if (this.draftNameForm.invalid || this.validatingDraftNameProgress) {
      return;
    }

    this.validatingDraftNameProgress = true;
    this.validationOutput = null;
    this.error = null;

    this.dataService.validateByDraftName(this.draftNameForm.get('draftName').value)
      .pipe(
        finalize(() => this.validatingDraftNameProgress = false),
        takeUntil(merge(this.componentDestroyed, this.formTypeChanged))
      )
      .subscribe(
        (output: ValidationOutput) => {
          if (output.isFinal()) {
            this.validationOutput = output;
            this.scrollToResults();
          } else {
            const modalRef: NgbModalRef = this.modalService.open(MissingModulesSelectionComponent);
            const modalComponent: MissingModulesSelectionComponent = modalRef.componentInstance;
            modalComponent.validationOutput = output;

            modalRef.result.then(
              (choosedRevisionsInput: ChosenMissingRevsInput) => {
                this.validatingRfcNumberProgress = true;

                if (choosedRevisionsInput !== null) {
                  this.dataService.chooseMissingRevsForPreviousRequest(output, choosedRevisionsInput)
                    .pipe(
                      finalize(() => this.validatingDraftNameProgress = false),
                      takeUntil(this.componentDestroyed)
                    ).subscribe(
                    () => {
                      this.validationOutput = output;
                      this.scrollToResults();
                    },
                    err => this.error = err
                  );
                } else {
                  this.dataService.validateByDraftName(this.draftNameForm.get('draftName').value)
                    .pipe(
                      finalize(() => this.validatingDraftNameProgress = false),
                      takeUntil(this.componentDestroyed)
                    )
                    .subscribe(
                      output2 => {
                        this.validationOutput = output2;
                        this.scrollToResults();
                      },
                      err => this.error = err
                    );
                }
              },
              () => {
              }
            );
          }
        },
        err => {
          this.error = err;
        }
      );
  }

  validateFiles() {
    if (this.validatingFilesProgress) {
      return;
    }

    this.validatingFilesProgress = true;
    this.validationOutput = null;
    this.error = null;

    const formData: FormData = new FormData();
    this.filesForm.form.get('attachments').value.forEach(
      o => formData.append('data', o.file)
    );

    this.dataService.preSetupFilesUpload(false, true)
      .pipe(
        mergeMap(cache => {
          return this.dataService.uploadPreSetFiles(cache, formData);
        }),
        finalize(() => this.validatingFilesProgress = false),
        takeUntil(merge(this.filesForm.selection, this.formTypeChanged, this.componentDestroyed))
      ).subscribe(
      output => {
        this.validatingFilesProgress = false;
        if (output.isFinal()) {
          this.validationOutput = output;
          this.scrollToResults();
        } else {
          const modalRef: NgbModalRef = this.modalService.open(MissingModulesSelectionComponent);
          const modalComponent: MissingModulesSelectionComponent = modalRef.componentInstance;
          modalComponent.validationOutput = output;

          modalRef.result.then(
            (choosedRevisionsInput: ChosenMissingRevsInput) => {
              this.validatingFilesProgress = true;
              this.dataService.chooseMissingRevsForPreviousRequest(output, choosedRevisionsInput)
                .pipe(
                  finalize(() => this.validatingFilesProgress = false),
                  takeUntil(this.componentDestroyed)
                ).subscribe(
                () => {
                  this.validationOutput = output;
                  this.scrollToResults();
                },
                err => this.error = err
              );
            },
            () => {
            }
          );
        }
      },
      err => {
        console.error(err);
        this.error = err;
      }
    );

  }

  validateDraftFile() {
    if (this.validatingDraftFileProgress) {
      return;
    }

    this.validatingDraftFileProgress = true;
    this.validationOutput = null;
    this.error = null;

    const formData: FormData = new FormData();
    this.draftFileForm.form.get('attachments').value.forEach(
      o => formData.append('data', o.file)
    );

    this.dataService.preSetupFilesUpload(false, true)
      .pipe(
        mergeMap(cache => {
          return this.dataService.uploadPreSetDraftFile(cache, formData);
        }),
        finalize(() => this.validatingDraftFileProgress = false),
        takeUntil(merge(this.draftFileForm.selection, this.formTypeChanged, this.componentDestroyed))
      ).subscribe(
      output => {
        this.validatingDraftFileProgress = false;
        if (output.isFinal()) {
          this.validationOutput = output;
          this.scrollToResults();
        } else {
          const modalRef: NgbModalRef = this.modalService.open(MissingModulesSelectionComponent);
          const modalComponent: MissingModulesSelectionComponent = modalRef.componentInstance;
          modalComponent.validationOutput = output;

          modalRef.result.then(
            (choosedRevisionsInput: ChosenMissingRevsInput) => {
              this.validatingDraftFileProgress = true;
              this.dataService.chooseMissingRevsForPreviousRequest(output, choosedRevisionsInput)
                .pipe(
                  finalize(() => this.validatingDraftFileProgress = false),
                  takeUntil(this.componentDestroyed)
                ).subscribe(
                () => {
                  this.validationOutput = output;
                  this.scrollToResults();
                },
                err => this.error = err
              );
            },
            () => {
            }
          );
        }
      },
      err => {
        console.error(err);
        this.error = err;
      }
    );

  }


  onCloseWarning() {
    this.validationOutput.warning = '';
  }

  private subscribeRouteParams() {
    this.route.params.subscribe(params => {
      if (params.hasOwnProperty('validating')) {
        const validatingActions = {
          files: 'showFilesForm',
          'draft-file': 'showDraftFileForm',
          'rfc-number': 'showRfcNumberForm',
          'draft-name': 'showDraftNameForm',
          api: 'showApiOverview'
        };
        if (validatingActions.hasOwnProperty(params['validating'])) {
          this[validatingActions[params['validating']]]();
        }
      }
    });
  }

  setActiveForm(form: string) {
    this.activeForm = form;
  }

  scrollToResults() {
    if (this.validationResults) {
      setTimeout(() => this.validationResults.nativeElement.scrollIntoView(), 100);
    }
  }
}
