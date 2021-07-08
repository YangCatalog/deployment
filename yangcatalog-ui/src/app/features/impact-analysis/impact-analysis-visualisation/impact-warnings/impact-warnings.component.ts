import { Component, OnInit } from '@angular/core';
import { ImpactVisNodeModel } from '../models/impact-vis-node-model';
import { ColDef } from 'ag-grid-community';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'yc-impact-warnings',
  templateUrl: './impact-warnings.component.html',
  styleUrls: ['./impact-warnings.component.scss']
})
export class ImpactWarningsComponent implements OnInit {

  warnings: string[];

  warningsObjs: any;
  colDefs: ColDef[] = [
    {colId: 'warning', field: 'warning', headerName: 'Warnings'},
  ];

  constructor(private modal: NgbActiveModal,) { }

  ngOnInit(): void {
    this.warningsObjs = this.warnings.map(w => {
      return {warning: w};
    });
  }

  onCancelClick() {
    this.modal.dismiss();
  }

}
