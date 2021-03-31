import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { YangSearchService } from './yang-search.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { ColDef, GridOptions } from 'ag-grid-community';
import { AppAgGridComponent } from '../../shared/ag-grid/app-ag-grid.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'yc-yang-search',
  templateUrl: './yang-search.component.html',
  styleUrls: ['./yang-search.component.scss']
})
export class YangSearchComponent implements OnInit, OnDestroy {
  @ViewChild('resultsGrid') resultsGrid: AppAgGridComponent;

  myBaseUrl = environment.WEBROOT_BASE_URL;

  form: FormGroup;
  searchingProgress = false;
  error: any;

  resultsContainerWidth = '100%';

  active = 1;
  private componentDestroyed: Subject<void> = new Subject<void>();
  results: any;

  // todo: move to separate file
  headerComponentParams = {
    template:
      '<div class="ag-cell-label-container" role="presentation">' +
      '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
      '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
      '    <span ref="eText" class="ag-header-cell-text" role="columnheader" style="white-space: normal;"></span>' +
      '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>' +
      '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
      '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
      '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>' +
      '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
      '  </div>' +
      '</div>'
  };

  allColDefs: ColDef[] = [
    {colId: 'name', field: 'name', maxWidth: 150, headerName: 'Name'},
    {colId: 'revision', field: 'revision', maxWidth: 90, headerName: 'Revision'},
    {colId: 'schemaType', field: 'schema-type', maxWidth: 130, headerName: 'Schematype'},
    {colId: 'path', field: 'path', maxWidth: 270, headerName: 'Path'},
    {colId: 'module', field: 'module-name', headerName: 'Module', maxWidth: 150},
    {colId: 'origin', field: 'origin', maxWidth: 130, headerName: 'Origin'},
    {colId: 'organization', field: 'organization', maxWidth: 140, headerName: 'Organization'},
    {colId: 'maturity', field: 'maturity', maxWidth: 100, headerName: 'Maturity'},
    {colId: 'importedByNumberModules', field: 'dependents', maxWidth: 120, headerName: 'Imported by # Modules'},
    {colId: 'compilationStatus', field: 'compilation-status', maxWidth: 130, headerName: 'Compilation Status'},
    {colId: 'description', field: 'description', headerName: 'Description', maxWidth: 400},
  ];
  currentColDefs = [];

  defaultColDef = {
    autoHeight: true,
    resizable: false,
    sortable: true,
    cellStyle: {'white-space': 'normal'},
    headerComponentParams: this.headerComponentParams
  };
  gridOptions: GridOptions = {
    onFirstDataRendered: () => {return this.headerHeightGetter},
    onColumnResized: () => {return this.headerHeightGetter}
  };
  resultsMaximized = false;
  searchedTermToBeHighlighted = '';

  constructor(
    private fb: FormBuilder,
    private dataService: YangSearchService
  ) { }

  headerHeightGetter = () => {
    const columnHeaderTexts = [
      document.querySelectorAll('.ag-header-cell-text')
    ];
    const  clientHeights = columnHeaderTexts.map(
      headerText => headerText['clientHeight']
    );
    const tallestHeaderTextHeight = Math.max(...clientHeights);

    return tallestHeaderTextHeight;
  }

  ngOnInit() {
    this.initForm();

    // this.form.get('searchFields').setValue(['module']);

  }

  private initForm() {
    this.form = this.fb.group({
      searchTerm: ['yang-catalog'],
      searchOptions: this.fb.group({
        caseSensitive: [false],
        regularExpression: [false],
        includeMibs: [false],
        onlyLatestRevs: [true],
      }),
      searchFields: this.fb.array(
        [
          this.fb.control('module'),
          this.fb.control('argument'),
          this.fb.control('description')
        ]
      ),
      yangVersions: this.fb.array([
        this.fb.control('1.0'),
        this.fb.control('1.1')
      ]),
      schemaTypes: this.fb.array([
        this.fb.control('typedef'),
        this.fb.control('grouping'),
        this.fb.control('feature'),
        this.fb.control('identity'),
        this.fb.control('extension'),
        this.fb.control('rpc'),
        this.fb.control('container'),
        this.fb.control('list'),
        this.fb.control('leaf-list'),
        this.fb.control('leaf'),
        this.fb.control('notification'),
        this.fb.control('action'),
      ]),
      outputColumns: this.fb.array([
        this.fb.control('name'),
        this.fb.control('revision'),
        this.fb.control('schema-type'),
        this.fb.control('path'),
        this.fb.control('module-name'),
        this.fb.control('origin'),
        this.fb.control('organization'),
        this.fb.control('maturity'),
        this.fb.control('dependents'),
        this.fb.control('compilation-status'),
        this.fb.control('description'),
      ]),
      advanced: this.fb.array([
        this.fb.group(
          {
            index: [0],
            term: [''],
            col: ['name'],
            op: ['and'],
          }
        )])

    });

    this.registerAdvancedSearchValueChangeEvents(0);
  }

  registerAdvancedSearchValueChangeEvents(index): void {
    this.form.get('advanced')['controls'][index].get('term').valueChanges
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe(
        searchTerm => {
          const advancedFormArray: FormArray = this.form.get('advanced') as FormArray;
          if (searchTerm.length && this.form.get('advanced')['controls'].length === index + 1) {
            const newGroup = this.fb.group({
                index: [index + 1],
                term: [''],
                col: ['name'],
                op: ['and'],
              }
            );
            advancedFormArray.push(newGroup);
            this.registerAdvancedSearchValueChangeEvents(index + 1);
          } else if (searchTerm.length === 0) {
            while (advancedFormArray.length > index + 1) {
              advancedFormArray.removeAt(advancedFormArray.length - 1);
            }
          }
        }
      );
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
  }



  goHome() {

  }

  onCloseError() {

  }

  onCheckChange(formControlName, event) {

    const formArray: FormArray = this.form.get(formControlName) as FormArray;
    if (event.target.checked) {
      formArray.push(new FormControl(event.target.value));
    } else {
      let i = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value === event.target.value) {
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  checkCheckedField(formGroupName: string, myValue: string): boolean {
    return this.form.get(formGroupName).value.indexOf(myValue) !== -1;
  }

  onSearchClick() {
    this.searchingProgress = true;
    this.searchedTermToBeHighlighted = this.form.get('searchTerm').value;
    this.results = null;
    this.currentColDefs = this.allColDefs.filter((col: ColDef) => this.form.get('outputColumns').value.indexOf(col.field) !== -1);
    const input = {
      'searched-term': this.form.get('searchTerm').value,
      'case-sensitive': this.form.get('searchOptions').get('caseSensitive').value,
      type: 'term',
      'include-mibs': this.form.get('searchOptions').get('includeMibs').value,
      'latest-revision': this.form.get('searchOptions').get('onlyLatestRevs').value,
      'searched-fields': this.form.get('searchFields').value,
      'yang-versions': this.form.get('yangVersions').value,
      'schema-types': this.form.get('schemaTypes').value,
      'output-columns': this.form.get('outputColumns').value,
      'sub-search': this.prepareSubSearchInput()
    };
    this.dataService.getSearchResults(input).pipe(
      finalize(() => this.searchingProgress = false),
      takeUntil(this.componentDestroyed)
    ).subscribe(
      results => {
        this.results = results;
      },
      err => {
        this.error = err;
        console.error(err);
      }
    );
  }

  onGridReady(event: any) {
    setTimeout(() => {
      const newSize = this.resultsGrid.getColsViewportScrollWidth() + 25;
      console.log('adjusting size to ', newSize);
      this.resultsContainerWidth = (newSize) + 'px';
    });
  }

  onMaximizeResultsClick() {
    this.resultsMaximized = true;
  }

  onRestoreResultsClick() {
    this.resultsMaximized = false;
  }

  getColumnsList(): any[] {
    return this.allColDefs.map(
      c => {
        return {value: c['field'], name: c['headerName']};
      }
    );
  }

  previousOr(index: number): boolean {
    const advancedFormArr: FormArray = this.form.get('advanced') as FormArray;
    return index > 0 && advancedFormArr.at(index - 1).get('op').value === 'or';
  }

  private prepareSubSearchInput() {
    const result = [];
    let subResult = {};
    result.push(subResult);

    this.form.get('advanced')['controls'].forEach(
      (fg: FormGroup) => {
        if (fg.get('term').value.length > 0) {
          subResult[fg.get('col').value] = fg.get('term').value;
          if (fg.get('op').value === 'or') {
            subResult = {};
            result.push(subResult);
          }
        }
      }
    );
    return result;
  }

  private encodeUriStr(input: string): string {
    return encodeURIComponent(input.replace(/\//g, '|'));
  }
  prepareNodeDetailUri(row: any) {
    let result = this.myBaseUrl + '/yang-search/show_node/';
    result = result + encodeURIComponent(row['module-name']) + '/' + encodeURIComponent(row['path']) + '/' + encodeURIComponent(row['revision']);
    // console.log(result);
    return result;
  }
}
