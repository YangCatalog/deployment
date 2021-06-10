import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, mergeMap, takeUntil } from 'rxjs/operators';
import { ImpactAnalysisService } from './impact-analysis.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'yc-impact-analysis',
  templateUrl: './impact-analysis.component.html',
  styleUrls: ['./impact-analysis.component.scss']
})
export class ImpactAnalysisComponent implements OnInit, OnDestroy {
  form: FormGroup;
  error: any;
  active = 1;
  items = ['ahoj'];
  chipsAnimDurations = {enter: '0', leave: '0'};
  autocomplete = this.autocompleteRequest.bind(this)
  loadingDetailsProgress = false;
  infoData = {};

  myBaseUrl = environment.WEBROOT_BASE_URL;
  private componentDestroyed: Subject<void> = new Subject<void>();


  constructor(private fb: FormBuilder, private dataService: ImpactAnalysisService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      moduleName: ['']
    });
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
  }



  onCloseError() {

  }

  autocompleteRequest(text$: Observable<string>) {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      mergeMap(term => {
          if (term.length > 2) {
            return this.dataService.getModuleAutocomplete(term.toLowerCase());
          } else {
            return of([]);
          }
        }
      ),
      takeUntil(this.componentDestroyed)
    );
  }


}
