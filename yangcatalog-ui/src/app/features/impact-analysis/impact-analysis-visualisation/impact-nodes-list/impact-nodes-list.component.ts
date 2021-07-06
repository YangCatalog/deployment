import { Component, OnInit } from '@angular/core';
import { ImpactVisNodeModel } from '../models/impact-vis-node-model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'yc-impact-nodes-list',
  templateUrl: './impact-nodes-list.component.html',
  styleUrls: ['./impact-nodes-list.component.scss']
})
export class ImpactNodesListComponent implements OnInit {

  nodesList: ImpactVisNodeModel[];
  colDefs: ColDef[] = [
    {colId: 'name', field: 'name'},
    {colId: 'organization', field: 'organization'},
    {colId: 'maturity', field: 'maturity'},
    {colId: 'actions', field: ''}
  ];

  constructor(private modal: NgbActiveModal,) { }

  ngOnInit(): void {
    console.log('ImpactVisNodeModel', this.nodesList);

  }

  onCancelClick() {
    this.modal.dismiss();
  }


}
