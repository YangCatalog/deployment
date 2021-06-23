import { Component, OnDestroy, OnInit } from '@angular/core';
import { ValidationOutput } from '../models/validation-output';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChosenMissingRevsInput } from '../models/chosen-missing-revs-input';
import { Subject } from 'rxjs';

@Component({
  selector: 'yc-missing-modules-selection',
  templateUrl: './missing-modules-selection.component.html',
  styleUrls: ['./missing-modules-selection.component.scss']
})
export class MissingModulesSelectionComponent implements OnInit, OnDestroy {

  validationOutput: ValidationOutput;
  selectMethodForm: FormGroup;
  selectingMissingDependencies = false;
  selectingExistingDependencies = false;
  missingDependencies: string[];
  existingDependencies: string[];

  selectionForm: FormGroup;

  private chosenRevisionsInput: ChosenMissingRevsInput;
  private componentDestroyed: Subject<void> = new Subject<void>();

  constructor(
    private modal: NgbActiveModal,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.selectionForm = new FormGroup({});
    this.missingDependencies = this.validationOutput.getMissingDependenciesList();
    this.existingDependencies = this.validationOutput.getExistingDependenciesList();

    this.missingDependencies.forEach(dependency => {
      this.selectionForm.addControl('rev_' + dependency, new FormControl(this.validationOutput.getMissingRevisions(dependency)[0]));
    });

    this.existingDependencies.forEach(dependency => {
      this.selectionForm.addControl('rev_' + dependency, new FormControl('uploaded'));
    });

  }

  fillLatest() {
    this.missingDependencies.forEach(missing => {
      this.selectionForm.get('rev_' + missing).setValue(this.validationOutput.getLatestMissingRevision(missing));
    });

    this.existingDependencies.forEach(existingDependency => {
      this.selectionForm.get('rev_' + existingDependency).setValue(this.validationOutput.getLatestExistingRevision(existingDependency));
    });
  }

  fillMyUploaded() {
    this.existingDependencies.forEach(existing => {
      this.selectionForm.get('rev_' + existing).setValue('uploaded');
    });

  }


  onFinishClick() {
    this.chosenRevisionsInput = new ChosenMissingRevsInput(this.validationOutput);
    this.missingDependencies.forEach(dependency => {
      this.chosenRevisionsInput.setDependencyRepoRevision(dependency, this.selectionForm.get('rev_' + dependency).value);
    });
    this.existingDependencies.forEach(dependency => {
      if (this.selectionForm.get('rev_' + dependency).value === 'uploaded') {
        this.chosenRevisionsInput.setDependencyUserRevision(dependency, this.validationOutput.getExistingUploadedRevision(dependency));
      } else {
        this.chosenRevisionsInput.setDependencyRepoRevision(dependency, this.selectionForm.get('rev_' + dependency).value);
      }
    });
    this.modal.close(this.chosenRevisionsInput);
  }


  ngOnDestroy(): void {
    this.componentDestroyed.next();
  }

  onCancelClick() {
    this.modal.dismiss();
  }

}
