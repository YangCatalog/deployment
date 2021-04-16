import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { YangTreeService } from './yang-tree.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Params } from '@angular/router';
import { TreeModel } from './models/tree-model';
import { TreeItemTableRowModel } from './models/tree-item-table-row-model';
import { ColDef, GridOptions, RowNode } from 'ag-grid-community';
import { AppAgGridComponent } from '../../shared/ag-grid/app-ag-grid.component';
import { faFolder} from '@fortawesome/free-regular-svg-icons/faFolder';
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons/faFolderOpen';
import { faLeaf } from '@fortawesome/free-solid-svg-icons/faLeaf';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons/faPlusSquare';
import { faMinusSquare } from '@fortawesome/free-regular-svg-icons/faMinusSquare';
import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'yc-yang-tree',
  templateUrl: './yang-tree.component.html',
  styleUrls: ['./yang-tree.component.scss']
})
export class YangTreeComponent implements OnInit, OnDestroy {

  @ViewChild('resultsGrid') resultsGrid: AppAgGridComponent;

  resultsContainerWidth = '100%';

  moduleName = '';
  revision = '';

  loading = false;

  faFolder = faFolder;
  faFolderOpen = faFolderOpen;
  faLeaf = faLeaf;
  faPlusSquare = faPlusSquare;
  faMinusSquare = faMinusSquare;
  faCopy = faCopy;

  tree: TreeModel;
  treeRows: TreeItemTableRowModel[];

  private componentDestroyed: Subject<void> = new Subject<void>();

  /**
   * todo: move to separate file
   */
  headerComponentParams = {
    template:
      '<div class="ag-cell-label-container" role="presentation">' +
      '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
      '  <div ref="eLabel" class="ag-header-cell-label" role="presentation" id="elementELabel">' +
      '    <span ref="eText" class="ag-header-cell-text" role="columnheader" style="white-space: normal;"></span>' +
      '  </div>' +
      '</div>'
  };

  allColDefs: ColDef[] = [
    {colId: 'element', field: 'text', headerName: 'Element', headerComponentParams: this.headerComponentParams, pinned: 'left'},
    {colId: 'schema', field: 'schema', headerName: 'Schema'},
    {colId: 'type', field: 'type', headerName: 'Type'},
    {colId: 'flags', field: 'flags', headerName: 'Flags'},
    {colId: 'opts', field: 'opts', headerName: 'Opts'},
    {colId: 'status', field: 'status', headerName: 'Status'},
    {colId: 'path', field: 'path', headerName: 'Path'},
    {colId: 'sensorPath', field: 'sensorPath', headerName: 'Sensor Path'},
  ];

  gridOptions: GridOptions = {
    pagination: false,
    isExternalFilterPresent: () => true,
    doesExternalFilterPass: (node: RowNode) => this.doesExternalFilterPass(node),
    getRowStyle: params => {return { background: 'white' }; }
  };

  defaultColDef = {
    autoHeight: false,
    resizable: true,
    sortable: false,
  };
  myBaseUrl = environment.WEBROOT_BASE_URL;
  error: any;


  constructor(private dataService: YangTreeService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.route.params
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe(
        (params: Params) => {
          if (params.hasOwnProperty('module')) {
            const moduleArr = params['module'].split('@');
            this.moduleName = moduleArr[0];
            this.revision = moduleArr[1];
            this.loadTreedata();
          }
        }
      );
  }

  doesExternalFilterPass(node: RowNode): boolean {
    const item: TreeItemTableRowModel = node.data;

    if (item.parent && item.parent.groupCollapsed) {
      return false;
    } else {
      return true;
    }
  }


  private loadTreedata() {
    this.loading = true;
    this.dataService.getTree(this.moduleName, this.revision).pipe(
      takeUntil(this.componentDestroyed)
    ).subscribe(
      res => {
        this.tree = res;
        this.treeRows = this.dataService.transformTreeToTablerows(this.tree);
        this.loading = false;
      },
      err => {
        this.error = err;
        this.loading = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
  }


  onGridReady(event: any) {
    document.getElementById('elementELabel').append(document.getElementById('collapseExpandDiv'));
    document.getElementById('collapseExpandDiv').style.display = 'inline';

    // setTimeout(() => {
    //   const newSize = this.resultsGrid.getColsViewportScrollWidth() + 25;
    //   this.resultsContainerWidth = (newSize) + 'px';
    // });
  }


  expandGroup(row: TreeItemTableRowModel) {
    row.groupCollapsed = false;
    this.resultsGrid.onFilterChanged();
  }

  collapseGroup(row: TreeItemTableRowModel) {
    row.collapseGroup();
    this.resultsGrid.onFilterChanged();
  }

  counter(i: number) {
    return new Array(i);
  }

  expandAll() {
    this.treeRows.forEach((tr: TreeItemTableRowModel) => tr.groupCollapsed = false);
    this.resultsGrid.onFilterChanged();

  }

  collapseAll() {
    this.treeRows.forEach((tr: TreeItemTableRowModel) => tr.groupCollapsed = true);
    this.resultsGrid.onFilterChanged();
  }

  prepareNodeDetailUri(row: any) {
    let result = this.myBaseUrl + '/yang-search/yang_tree/show_node/';
    result = result + this.moduleName + '/' + encodeURIComponent(row['showNodePath']) + '/' + this.revision;
    return result;
  }

}
