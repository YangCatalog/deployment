import { Component, OnInit } from '@angular/core';
import { ImpactVisNodeModel } from '../models/impact-vis-node-model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ColDef } from 'ag-grid-community';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'yc-impact-nodes-list',
  templateUrl: './impact-nodes-list.component.html',
  styleUrls: ['./impact-nodes-list.component.scss']
})
export class ImpactNodesListComponent implements OnInit {

  myBaseUrl = environment.WEBROOT_BASE_URL;

  nodesList: ImpactVisNodeModel[];
  colDefs: ColDef[] = [
    {colId: 'name', field: 'name'},
    {colId: 'organization', field: 'organization'},
    {colId: 'maturity', field: 'maturity'},
    {colId: 'actions', field: ''}
  ];
  defaultColDef = {
    autoHeight: true,
    resizable: false,
    sortable: true,
    cellStyle: {'white-space': 'normal'},
  };

  constructor(private modal: NgbActiveModal,) { }

  ngOnInit(): void {

  }

  onCancelClick() {
    this.modal.dismiss();
  }


}
