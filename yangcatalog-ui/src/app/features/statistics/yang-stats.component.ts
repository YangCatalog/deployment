import { Component, OnDestroy, OnInit } from '@angular/core';
import { YangStatsService } from './yang-stats.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { YangStatsModel } from './models/yang-stats-model';
import { ColDef, GridOptions } from 'ag-grid-community';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { YangStatCiscoVersionPlatform } from './models/yang-stat-cisco-version-platform';

@Component({
  selector: 'yc-stats',
  templateUrl: './yang-stats.component.html',
  styleUrls: ['./yang-stats.component.scss']
})
export class YangStatsComponent implements OnInit, OnDestroy {

  loading = true;
  stats: YangStatsModel;

  error: any;


  private componentDestroyed: Subject<void> = new Subject<void>();
  active: 1;


  ciscoStandards = ['nx', 'xr', 'xe'];
  ciscoStatsSelection = 'nx';

  faCheck = faCheck;
  faTimes = faTimes;

  nxTemplateMap = {
    nexus9000: 'versionPlatformTemplate',
    nexus3000: 'versionPlatformTemplate'
  };

  xeTemplateMap = {
    ASR920: 'versionPlatformTemplate',
    C8000V: 'versionPlatformTemplate',
    IR1101: 'versionPlatformTemplate',
    ISR4000: 'versionPlatformTemplate',
    NCS4200: 'versionPlatformTemplate',
    cat9300: 'versionPlatformTemplate',
    ESS3x00: 'versionPlatformTemplate',
    C8200: 'versionPlatformTemplate',
    CAT9400: 'versionPlatformTemplate',
    CAT9500: 'versionPlatformTemplate',
    cat3k: 'versionPlatformTemplate',
    CSR1000V: 'versionPlatformTemplate',
    CAT3650: 'versionPlatformTemplate',
    C8500: 'versionPlatformTemplate',
    CAT9600: 'versionPlatformTemplate',
    cat9500: 'versionPlatformTemplate',
    CAT9300: 'versionPlatformTemplate',
    IE3x00: 'versionPlatformTemplate',
    CAT9800: 'versionPlatformTemplate',
    C8500L: 'versionPlatformTemplate',
    CAT3850: 'versionPlatformTemplate',
    ASR1000: 'versionPlatformTemplate',
    C8300: 'versionPlatformTemplate',
    'RSP2/RSP3': 'versionPlatformTemplate',
    'CBR-8': 'versionPlatformTemplate',
    CAT9200: 'versionPlatformTemplate',
    ASR900: 'versionPlatformTemplate',
    ISR1000: 'versionPlatformTemplate',
    NCS520: 'versionPlatformTemplate',
  };
  xrTemplateMap = {
    ncs1001: 'versionPlatformTemplate',
    ncs540l: 'versionPlatformTemplate',
    _8000: 'versionPlatformTemplate',
    iosxrvX64: 'versionPlatformTemplate',
    ncs1k: 'versionPlatformTemplate',
    ncs2k: 'versionPlatformTemplate',
    iosxrwbd: 'versionPlatformTemplate',
    ncs560: 'versionPlatformTemplate',
    ncs5500: 'versionPlatformTemplate',
    hfrPx: 'versionPlatformTemplate',
    xrv9k: 'versionPlatformTemplate',
    ncs5k: 'versionPlatformTemplate',
    asr9KPx: 'versionPlatformTemplate',
    asr9KX64: 'versionPlatformTemplate',
    ncs1004: 'versionPlatformTemplate',
    ncs540: 'versionPlatformTemplate',
    xrvr: 'versionPlatformTemplate',
    ncs6k: 'versionPlatformTemplate',
    ncs5700: 'versionPlatformTemplate',
  };


  gridOptions: GridOptions = {
    onFirstDataRendered: () => {
      return this.headerHeightGetter;
    },
    onColumnResized: () => {
      return this.headerHeightGetter;
    }
  };

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


  defaultColDef = {
    autoHeight: true,
    resizable: false,
    sortable: true,
    cellStyle: {'white-space': 'normal'},
    headerComponentParams: this.headerComponentParams
  };

  collDefsSdo: ColDef[] = [
    {colId: 'name', field: 'name', headerName: 'SDOs and Opensource'},
    {colId: 'numGithub', field: 'numGithub', headerName: 'Number in Gituhub'},
    {colId: 'numCatalog', field: 'numCatalog', headerName: 'Number in Catalog'},
    {colId: 'percentageCompile', field: 'percentageCompile', headerName: '% that pass Compilation'},
    {colId: 'percentageExtra', field: 'percentageExtra', headerName: '% with Metadata'},
  ];
  collDefsVendor: ColDef[] = [
    {colId: 'name', field: 'name', headerName: 'Vendor'},
    {colId: 'numGithub', field: 'numGithub', headerName: 'Number in Gituhub'},
    {colId: 'numCatalog', field: 'numCatalog', headerName: 'Number in Catalog'},
    {colId: 'percentageCompile', field: 'percentageCompile', headerName: '% that pass Compilation'},
    {colId: 'percentageExtra', field: 'percentageExtra', headerName: '% with Metadata'},
  ];
  collDefsCiscoNx: ColDef[] = [
    {colId: 'version', field: 'version', headerName: 'nx - version \\ platform'},
    {colId: 'nexus9000', field: 'nexus9000', headerName: 'Nexus 9000'},
    {colId: 'nexus3000', field: 'nexus3000', headerName: 'Nexus 3000'},
  ];

  collDefsCiscoXr: ColDef[] = [
    {colId: 'version', field: 'version', headerName: 'xr - version \\ platform', pinned: 'left'},
    {colId: 'ncs1001', field: 'ncs1001', headerName: 'ncs1001'},
    {colId: 'ncs540l', field: 'ncs540l', headerName: 'ncs540l'},
    {colId: '_8000', field: '_8000', headerName: '8000'},
    {colId: 'iosxrvX64', field: 'iosxrvX64', headerName: 'iosxrv-x64'},
    {colId: 'ncs1k', field: 'ncs1k', headerName: 'ncs1k'},
    {colId: 'ncs2k', field: 'ncs2k', headerName: 'ncs2k'},
    {colId: 'iosxrwbd', field: 'iosxrwbd', headerName: 'iosxrwbd'},
    {colId: 'ncs560', field: 'ncs560', headerName: 'ncs560'},
    {colId: 'ncs5500', field: 'ncs5500', headerName: 'ncs5500'},
    {colId: 'hfrPx', field: 'hfrPx', headerName: 'hfr-px'},
    {colId: 'xrv9k', field: 'xrv9k', headerName: 'xrv9k'},
    {colId: 'ncs5k', field: 'ncs5k', headerName: 'ncs5k'},
    {colId: 'asr9KPx', field: 'asr9KPx', headerName: 'asr9k-px'},
    {colId: 'asr9KX64', field: 'asr9KX64', headerName: 'asr9k-x64'},
    {colId: 'ncs1004', field: 'ncs1004', headerName: 'ncs1004'},
    {colId: 'ncs540', field: 'ncs540', headerName: 'ncs540'},
    {colId: 'xrvr', field: 'xrvr', headerName: 'xrvr'},
    {colId: 'ncs6k', field: 'ncs6k', headerName: 'ncs6k'},
    {colId: 'ncs5700', field: 'ncs5700', headerName: 'ncs5700'},
  ];


  colDefsCiscoXe: ColDef[] = [
    {colId: 'version', field: 'version', headerName: 'xe - version \\ platform', pinned: 'left'},
    {colId: 'ASR920', field: 'ASR920', headerName: 'ASR920'},
    {colId: 'C8000V', field: 'C8000V', headerName: 'C8000V'},
    {colId: 'IR1101', field: 'IR1101', headerName: 'IR1101'},
    {colId: 'ISR4000', field: 'ISR4000', headerName: 'ISR4000'},
    {colId: 'NCS4200', field: 'NCS4200', headerName: 'NCS4200'},
    {colId: 'cat9300', field: 'cat9300', headerName: 'cat9300'},
    {colId: 'ESS3x00', field: 'ESS3x00', headerName: 'ESS3x00'},
    {colId: 'C8200', field: 'C8200', headerName: 'C8200'},
    {colId: 'CAT9400', field: 'CAT9400', headerName: 'CAT9400'},
    {colId: 'CAT9500', field: 'CAT9500', headerName: 'CAT9500'},
    {colId: 'cat3k', field: 'cat3k', headerName: 'cat3k'},
    {colId: 'CSR1000V', field: 'CSR1000V', headerName: 'CSR1000V'},
    {colId: 'CAT3650', field: 'CAT3650', headerName: 'CAT3650'},
    {colId: 'C8500', field: 'C8500', headerName: 'C8500'},
    {colId: 'CAT9600', field: 'CAT9600', headerName: 'CAT9600'},
    {colId: 'cat9500', field: 'cat9500', headerName: 'cat9500'},
    {colId: 'CAT9300', field: 'CAT9300', headerName: 'CAT9300'},
    {colId: 'IE3x00', field: 'IE3x00', headerName: 'IE3x00'},
    {colId: 'CAT9800', field: 'CAT9800', headerName: 'CAT9800'},
    {colId: 'C8500L', field: 'C8500L', headerName: 'C8500L'},
    {colId: 'CAT3850', field: 'CAT3850', headerName: 'CAT3850'},
    {colId: 'ASR1000', field: 'ASR1000', headerName: 'ASR1000'},
    {colId: 'C8300', field: 'C8300', headerName: 'C8300'},
    {colId: 'RSP2/RSP3', field: 'RSP2/RSP3', headerName: 'RSP2/RSP3'},
    {colId: 'CBR-8', field: 'CBR-8', headerName: 'CBR-8'},
    {colId: 'CAT9200', field: 'CAT9200', headerName: 'CAT9200'},
    {colId: 'ASR900', field: 'ASR900', headerName: 'ASR900'},
    {colId: 'ISR1000', field: 'ISR1000', headerName: 'ISR1000'},
    {colId: 'NCS520', field: 'NCS520', headerName: 'NCS520'},
  ];




  constructor(private dataService: YangStatsService) {
  }

  ngOnInit(): void {



  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
  }


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


}

