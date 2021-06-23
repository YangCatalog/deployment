import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef, ViewChild,
} from '@angular/core';
import {
  ColDef,
  ColumnApi,
  GridApi,
  GridOptions,
  GridSizeChangedEvent,
  RowNode
} from 'ag-grid-community';
import { AgCellTemplateRendererComponent } from './ag-cell-template-renderer/ag-cell-template-renderer.component';
import { Observable, Subject, Subscription } from 'rxjs';
import { AppUtilsService } from '../../core/app-utils.service';

@Component({
  selector: 'yc-ag-grid',
  templateUrl: './app-ag-grid.component.html',
  styleUrls: ['./app-ag-grid.component.css']
})
export class AppAgGridComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild('containerDiv') containerDiv: ElementRef;

  @Input() tableId: string;

  /**
   * List of all column definitions, that can be displayed in table
   */
  @Input() allColumnDefs: ColDef[] = [];
  @Input() gridOptions: GridOptions;

  @Input() visible: boolean;
  @Input() suppressHorizontalScroll = false;


  @Input() headerHeight = 50;
  @Input() rowHeight = 50;
  @Input() rowData: any = undefined;
  @Input() pagination = true;

  @Input() rowSelection = undefined;

  @Input() headerCheckboxSelection = true;
  @Input() multiselection = false;

  @Input() frameworkComponents: any;

  @Input() templateMap: any;

  @Output() rowClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() cellMouseOver: EventEmitter<any> = new EventEmitter<any>();
  @Output() cellMouseOut: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();

  @ContentChildren(TemplateRef) templates: QueryList<any>;

  /**
   * Fields, which can not be hidden using columnsCustomizationTool
   * @type {any[]}
   */
  @Input() mandatoryCols: string[] = [];
  /**
   * Fields, that won`t be displayed unless user enables them using columnsCustomizationTool
   */
  @Input() hiddenCols: string[] = [];
  @Input() defaultColDef: ColDef;

  @Output() gridReady: EventEmitter<any> = new EventEmitter();

  @Input() domLayout = '';

  currentGridWidth: number;

  /**
   * For row reselection functionality
   */
  private selectedRows: RowNode[] = [];
  protected currentFilterModel: any;
  protected selectionChangedSubj: Subject<any[]> = new Subject<any[]>();
  gridApi: GridApi;

  columnApi: ColumnApi;
  columnDefs: ColDef[];
  itemsFrom = 0;
  itemsTo = 0;
  currentPageNumber = 0;
  itemsPerPageNumber = '25';
  pages: number[] = [1];
  allPagesCount = 0;
  currentPageSize = 0;
  itemsCount = 0;
  private componentDestroyed: Subject<void> = new Subject<void>();

  constructor(
    private appUtilsService: AppUtilsService,
    private elementRef: ElementRef
  ) {
  }

  ngAfterViewInit(): void {

    if (!this.defaultColDef) {
      this.defaultColDef = {
        comparator: (valueA, valueB) => {
          let result = 0;
          valueA = this.appUtilsService.normalizeMixedDataValue(valueA);
          valueB = this.appUtilsService.normalizeMixedDataValue(valueB);
          if (valueA > valueB) {
            result = 1;
          } else if (valueA < valueB) {
            result = -1;
          }
          return result;
        }
      };
    }

    this.allColumnDefs.forEach(colDef => {
      const colTemplateRef = this.getTemplateForColumn(colDef.colId);
      if (colTemplateRef) {
        colDef.cellRendererFramework = AgCellTemplateRendererComponent;
        colDef.cellRendererParams = {
          ngTemplate: colTemplateRef
        };
      }
    });


    setTimeout(() => {
      this.columnDefs = [];
      if (this.multiselection) {
        this.columnDefs = [
          {
            colId: 'selectionField',
            headerName: '',
            headerCheckboxSelection: this.headerCheckboxSelection,
            checkboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
            maxWidth: 66,
            pinned: 'left'
          }
        ];
      }
      this.columnDefs = this.columnDefs.concat(this.allColumnDefs);
    });

  }

  ngOnInit() {
    this.setGridOptions();

    if (!this.tableId) {
      throw new Error('Missing tableId');
    }

  }

  /**
   * Used for displaying horisontal scrollbar for the whole page containing this grid,
   * once this method is called, horisontal scrollbar for the whole page will be displayed acording to grid width
   */
  getColsViewportScrollWidth(): number {
    return this.elementRef.nativeElement.querySelector('.ag-center-cols-viewport').scrollWidth;

  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();

  }

  refreshView(): void {
    if (this.gridApi) {
      this.gridApi.setRowData(this.rowData);
      this.gridApi.redrawRows();
    }
  }

  onRowDataChanged() {
    this.resetFilter();
    this.fitSize();
  }


  showOnlyColumns(columnIds: string[]) {
    this.allColumnDefs.forEach(
      (colDef: ColDef) => (colDef.hide = columnIds.indexOf(colDef['colId']) === -1)
    );
    this.resetColumnsVisibility();
  }

  resetColumnsVisibility(): void {
    if (this.columnApi && this.gridApi) {
      this.columnDefs.forEach((colDef: ColDef) => {
        this.columnApi.setColumnVisible(colDef.colId, !!!colDef.hide);
      });
      this.fitSize();
    }
  }

  fitSize(): void {
    setTimeout(() => {
      const element = this.elementRef.nativeElement;
      let allColsSize = 0;
      if (this.gridApi && this.columnApi && element.offsetParent !== null) {
        this.columnApi.autoSizeAllColumns();
        this.columnApi.getAllDisplayedColumns().forEach(col => {
          allColsSize = allColsSize + col.getActualWidth();
        });
        if (this.currentGridWidth >= allColsSize) {
          this.gridApi.sizeColumnsToFit();
        }
      }
    });

  }

  autosize(): void {
    this.gridApi.sizeColumnsToFit();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.resetColumnsVisibility();

    this.gridReady.emit(params);
  }

  onPaginationChanged(params): void {
    const gridApi: GridApi = this.gridApi ? this.gridApi : params.api;

    this.itemsCount = gridApi.paginationGetRowCount();
    this.itemsFrom = gridApi.paginationGetCurrentPage() * gridApi.paginationGetPageSize() + 1;
    if (this.itemsFrom > this.itemsCount) {
      this.itemsFrom = this.itemsCount;
    }
    this.itemsTo = (gridApi.paginationGetCurrentPage() + 1) * gridApi.paginationGetPageSize();
    if (this.itemsTo > this.itemsCount) {
      this.itemsTo = this.itemsCount;
    }
    this.currentPageNumber = gridApi.paginationGetCurrentPage() + 1;
    this.allPagesCount = gridApi.paginationGetTotalPages();
    if (this.currentPageNumber > this.allPagesCount) {
      this.currentPageNumber = this.allPagesCount;
    }
    this.pages = [];
    for (let i = 0; i < this.allPagesCount; i++) {
      this.pages.push(i + 1);
    }
    this.currentPageSize = gridApi.paginationGetPageSize();
  }

  onGridSizeChanged(params: GridSizeChangedEvent) {
    this.currentGridWidth = params.clientWidth;
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.fitSize();
  }

  setRowData(): void {
    if (this.gridApi) {
      this.gridApi.setRowData(this.rowData);
    }
  }

  protected getTemplateForColumn(colId: string): TemplateRef<any> {

    if (this.templateMap && this.templateMap.hasOwnProperty(colId)) {
      return this.templates.find(ref => {
        return ref['_declarationTContainer']['localNames'].indexOf(this.templateMap[colId]) !== -1;
      });
    } else {
      return this.templates.find(ref => {
        // console.log(ref);
        // return ref._def && ref._def.references.hasOwnProperty(colId + 'ColumnTemplate');
        return ref['_declarationTContainer']['localNames'].indexOf(colId + 'ColumnTemplate') !== -1;
      });
    }
  }

  getSelectedRows(): any[] {
    if (this.gridApi) {
      return this.gridApi.getSelectedRows();
    } else {
      return [];
    }
  }

  clearSelection(): void {
    if (this.gridApi) {
      this.gridApi.deselectAll();
      this.selectedRows = [];
    }
  }

  setSelection(compositeKey: string[], savedNodesData: any[]): void {
    if (this.gridApi && compositeKey && compositeKey.length) {
      this.gridApi.forEachNode((node: RowNode) => {
        const loadedNodesFilteredData: any[] = compositeKey.map(key => this.resolvePath(node.data, key));
        savedNodesData.forEach(savedNodeData => {
          const savedNodesFilteredData: any[] = compositeKey.map(k => this.resolvePath(savedNodeData, k));
          if (loadedNodesFilteredData.join() === savedNodesFilteredData.join()) {
            node.setSelected(true);
          }
        });
      });
    } else {
      console.error('CompositeKey or grid not present');
    }
  }

  private resolvePath(dataObj: Object, key: string): any {
    const pathComponents: string[] = key.split('.');
    let resolvedVal = dataObj;
    pathComponents.forEach((pathComponent: string) => {
      if (resolvedVal[pathComponent]) {
        resolvedVal = resolvedVal[pathComponent];
      } else {
        console.error('Could not resolve object path');
        return undefined;
      }
    });
    return resolvedVal;
  }

  resetFilter() {
    if (this.gridApi && this.currentFilterModel) {
      this.gridApi.setFilterModel(this.currentFilterModel);
    }
  }

  saveFilterModel() {
    if (this.gridApi) {
      this.currentFilterModel = this.gridApi.getFilterModel();
      this.fitSize();
    }
  }

  onSelectionChanged(event: any) {
    this.selectionChangedSubj.next(event.api.getSelectedRows());
  }

  getSelectionChangedObservable(): Observable<any[]> {
    return this.selectionChangedSubj.asObservable();
  }

  onRowClicked(event: any) {
    this.rowClicked.emit(event);
  }

  onFirstPageClick() {
    this.gridApi.paginationGoToFirstPage();
    this.fitSize();
  }

  onCellMouseOver(event: any) {
    this.cellMouseOver.emit(event);
  }

  onPrevPageClick() {
    this.gridApi.paginationGoToPreviousPage();
    this.fitSize();
  }

  onCellMouseOut(event: any) {
    this.cellMouseOut.emit(event);
  }

  onNextPageClick() {
    this.gridApi.paginationGoToNextPage();
    this.fitSize();
  }

  onLastPageClick() {
    this.gridApi.paginationGoToLastPage();
    this.fitSize();
  }

  onPageSelectionChanged(changeEvent: any) {
    this.gridApi.paginationGoToPage(changeEvent.value - 1);
    this.fitSize();
  }

  resetRowHeights(): void {
    this.gridApi.resetRowHeights();
  }

  onItemsPerPageSelectionChanged(changeEvent: any) {
    this.gridApi.paginationSetPageSize(1 * changeEvent.value);
    this.fitSize();
  }

  onFilterChanged(): void {
    if (this.gridApi) {
      this.gridApi.onFilterChanged();
    }
  }


  getFrameworkComponentInstance(filterInstanceId: string): any {
    if (this.gridApi) {
      return this.gridApi.getFilterInstance(filterInstanceId).getFrameworkComponentInstance();
    }
  }

  private setGridOptions() {
    if (!this.gridOptions) {
      this.gridOptions = {
        suppressColumnVirtualisation: true,
        rowBuffer: 25,
        enableCellTextSelection: true,
        ensureDomOrder: true
      };
    } else {
      this.gridOptions['suppressColumnVirtualisation'] = true;
      this.gridOptions['rowBuffer'] = 25;
      this.gridOptions['enableCellTextSelection'] = true;
      this.gridOptions['ensureDomOrder'] = true;
    }
  }



}
