import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { merge, Observable, of, Subject, zip } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, mergeMap, takeUntil } from 'rxjs/operators';
import { YangModuleDetailsService } from './yang-module-details.service';
import { ModuleInfoMetaDataModel } from './models/module-info-meta-data-model';
import { ModuleDetailsModel } from './models/module-details-model';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'yc-yang-module-details',
  templateUrl: './yang-module-details.component.html',
  styleUrls: ['./yang-module-details.component.scss']
})
export class YangModuleDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('revisionTemplate') public revisionTemplate: TemplateRef<any>;
  @ViewChild('plainTextTemplate') public plainTextTemplate: TemplateRef<any>;
  @ViewChild('linkTemplate') public linkTemplate: TemplateRef<any>;
  @ViewChild('mailTemplate') public mailTemplate: TemplateRef<any>;
  @ViewChild('formatedTextTemplate') public formatedTextTemplate: TemplateRef<any>;
  @ViewChild('nestedObjectTemplate') public nestedDataTemplate: TemplateRef<any>;
  @ViewChild('nestedListOfObjectsTemplate') public nestedListOfObjectsTemplate: TemplateRef<any>;

  myBaseUrl = environment.WEBROOT_BASE_URL;

  form: FormGroup;
  loadingDetailsProgress = false;

  metaData: ModuleInfoMetaDataModel;
  infoData: ModuleDetailsModel;
  error: any;

  autocomplete = this.autocompleteRequest.bind(this);

  expanded = {};

  private componentDestroyed: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dataService: YangModuleDetailsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.subscribeRouteParams();
  }

  private subscribeRouteParams() {
    merge(this.route.params, this.route.queryParams).subscribe(
      params => {
        if (params.hasOwnProperty('module')) {
          const moduleNameArr = params['module'].split('@');
          this.form.get('moduleName').setValue(moduleNameArr[0]);
          this.form.get('moduleRevision').setValue(moduleNameArr[1]);
          this.loadModuleDetails();
        }
      }
    );

  }

  private initForm() {
    this.form = this.fb.group({
      moduleName: ['', Validators.required],
      moduleRevision: ['']
    });
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
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


  onCloseError() {
    this.error = null;
  }

  loadModuleDetails() {
    if (this.form.invalid) {
      return;
    }

    let requestModuleName = this.form.get('moduleName').value;
    if (this.form.get('moduleRevision').value) {
      requestModuleName += '@' + this.form.get('moduleRevision').value;
    }

    this.error = null;
    this.loadingDetailsProgress = true;
    this.infoData = null;
    this.metaData = null;

    zip(
      this.dataService.getModuleInfoHelp().pipe(takeUntil(this.componentDestroyed)),
      this.dataService.getModuleDetails(requestModuleName).pipe(takeUntil(this.componentDestroyed))
    ).pipe(
      finalize(() => this.loadingDetailsProgress = false)
    ).subscribe(
      ([meta, info]) => {
        this.metaData = meta;
        this.infoData = info;
        this.form.get('moduleRevision').setValue(this.infoData.data['revision']);
      },
      err => {
        this.error = err;
      }
    );
  }

  onGetDetailsClick() {
    const newRoute = this.myBaseUrl + '/yang-search/module_details/' + this.form.get('moduleName').value;
    // this.router.navigate([newRoute]);
    window.location.href = newRoute;
  }

  onRevisionSelectChange(event: Event) {
    const newRoute = this.myBaseUrl + '/yang-search/module_details/' + this.form.get('moduleName').value + '@' + this.form.get('moduleRevision').value;
    // this.router.navigate([newRoute]);
    window.location.href = newRoute;

  }

  getPropTemplate(property: string, isNested = false): TemplateRef<any> {
    const templatesMapping = {
      revision: isNested ? 'plainTextTemplate' : 'revisionTemplate',
      namespace: 'linkTemplate',
      'compilation-result': 'linkTemplate',
      schema: 'linkTemplate',
      reference: 'linkTemplate',
      'yang-tree': 'linkTemplate',
      description: 'formatedTextTemplate',
      contact: 'formatedTextTemplate',
      'yang-version': 'formatedTextTemplate',
      ietf : 'nestedDataTemplate',
      dependencies: 'nestedListOfObjectsTemplate',
      dependents: 'nestedListOfObjectsTemplate',
      'author-email': 'mailTemplate',
      implementations: 'nestedListOfObjectsTemplate',

    };
    if (templatesMapping.hasOwnProperty(property)) {
     return this[templatesMapping[property]];
    } else {
      return this.plainTextTemplate;
    }
  }

  expandCollapsableObject(key: string): void {
    this.expanded[key] = true;
  }

  collapseObject(key: string): void {
    this.expanded[key] = false;
  }

}
