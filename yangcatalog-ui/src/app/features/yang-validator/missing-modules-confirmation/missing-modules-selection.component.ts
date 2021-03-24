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
    this.selectMethodForm = this.fb.group({
      missingDependenciesSelection: ['latest'],
      existingDependenciesSelection: ['my']
    });
    this.missingDependencies = this.validationOutput.getMissingDependenciesList();
    this.existingDependencies = this.validationOutput.getExistingDependenciesList();
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
  }

  onCancelClick() {
    this.modal.dismiss();
  }

  onStartMissingSelectionClick() {
    this.chosenRevisionsInput = new ChosenMissingRevsInput(this.validationOutput);

    if (this.selectMethodForm.get('missingDependenciesSelection').value === 'latest') {
      this.finishMissingUsingLatest();
    } else {
      this.selectingMissingDependencies = true;

      this.selectionForm = new FormGroup({});
      this.missingDependencies.forEach(moduleName => {
        this.selectionForm.addControl('rev_' + moduleName, new FormControl(this.validationOutput.getMissingRevisions(moduleName)[0]));
      });
    }
  }

  private finishMissingUsingLatest() {
    this.missingDependencies.forEach(missing => {
      this.chosenRevisionsInput.setDependencyRepoRevision(missing, this.validationOutput.getLatestMissingRevision(missing));
    });
    this.missingDependencies = [];
    this.selectingMissingDependencies = false;
    if (this.existingDependencies.length === 0) {
      this.modal.close(this.chosenRevisionsInput);
    }
  }

  onStartExistingSelectionClick() {
    if (!this.chosenRevisionsInput) {
      this.chosenRevisionsInput = new ChosenMissingRevsInput(this.validationOutput);
    }

    if (this.selectMethodForm.get('existingDependenciesSelection').value === 'latest') {
      this.finishExistingUsingLatest();
    } else if (this.selectMethodForm.get('existingDependenciesSelection').value === 'my') {
      this.finishExistingUsingMy();
    } else {
      this.selectingExistingDependencies = true;
      this.selectionForm = new FormGroup({});
      this.existingDependencies.forEach(moduleName => {
        this.selectionForm.addControl('rev_' + moduleName, new FormControl(this.validationOutput.getExistingRepoRevisions(moduleName)[0]));
      });
    }
  }

  onContinueMissingSelectionClick() {
    const m = this.missingDependencies.shift();
    this.chosenRevisionsInput.setDependencyRepoRevision(m, this.selectionForm.get('rev_' + m).value);
    if (this.missingDependencies.length === 0) {
        this.selectingMissingDependencies = false;
    }
  }

  onContinueExistingSelectionClick() {
    const m = this.existingDependencies.shift();
    if (this.selectionForm.get('rev_' + m).value === 'uploaded') {
      this.chosenRevisionsInput.setDependencyUserRevision(m, this.validationOutput.getExistingUploadedRevision(m));
    } else {
      this.chosenRevisionsInput.setDependencyRepoRevision(m, this.selectionForm.get('rev_' + m).value);
    }

  }


  onFinishMissingSelectionClick() {
    this.chosenRevisionsInput.setDependencyRepoRevision(this.missingDependencies[0], this.selectionForm.get('rev_' + this.missingDependencies[0]).value);
    this.modal.close(this.chosenRevisionsInput);
  }

  onFinishExistingSelectionClick() {
    if (this.selectionForm.get('rev_' + this.existingDependencies[0]).value === 'uploaded') {
      this.chosenRevisionsInput.setDependencyUserRevision(this.existingDependencies[0], this.validationOutput.getExistingUploadedRevision(this.existingDependencies[0]));
    } else {
      this.chosenRevisionsInput.setDependencyRepoRevision(this.existingDependencies[0], this.selectionForm.get('rev_' + this.existingDependencies[0]).value);
    }
    this.modal.close(this.chosenRevisionsInput);
  }


  private finishExistingUsingLatest() {
    this.existingDependencies.forEach(existingDependency => {
      const latestRev = this.validationOutput.getLatestExistingRevision(existingDependency);
      if (latestRev !== this.validationOutput.getExistingUploadedRevision(existingDependency)) {
        this.chosenRevisionsInput.setDependencyRepoRevision(existingDependency, latestRev);
      }
    });
    this.modal.close(this.chosenRevisionsInput);
  }

  private finishExistingUsingMy() {
    // no action required if uploaded files should be used
    this.modal.close(this.chosenRevisionsInput);
  }
}
