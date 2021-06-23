import { ChangeDetectorRef, Component, NgZone, TemplateRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'yc-ag-cell-template-renderer',
  templateUrl: './ag-cell-template-renderer.component.html',
  styleUrls: ['./ag-cell-template-renderer.component.css']
})
export class AgCellTemplateRendererComponent implements ICellRendererAngularComp {

  template: TemplateRef<any>;
  templateContext: { $implicit: any, params: any };

  constructor(private zone: NgZone) {}

  refresh(params: any): boolean {
    this.templateContext = {
      $implicit: params.data,
      params
    };
    this.zone.run(() => {});
    return true;
  }

  agInit(params: ICellRendererParams): void {
    this.template = params['ngTemplate'];
    this.refresh(params);
  }

}
