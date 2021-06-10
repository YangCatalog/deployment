import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { filter, merge, mergeMap, takeUntil } from 'rxjs/operators';
import { YangSearchService } from '../yang-search/yang-search.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'yc-yang-show-node',
  templateUrl: './yang-show-node.component.html',
  styleUrls: ['./yang-show-node.component.scss']
})
export class YangShowNodeComponent implements OnInit, OnDestroy {

  private componentDestroyed: Subject<void> = new Subject<void>();

  node = '';
  path = '';
  revision = '';
  resultStr = 'Loading content...';
  nodeName = '';
  nodeType = '';
  error: any;
  paramsSetManually: Subject<boolean> = new Subject<boolean>();

  constructor(
    protected route: ActivatedRoute,
    protected dataService: YangSearchService,
  ) { }

  ngOnInit(): void {

    this.route.params
      .pipe(
        filter(params => params.hasOwnProperty('node')),
        mergeMap(params => {
            this.node = params['node'];
            this.path = params['path'];
            this.revision = params['revision'];
            this.parseNodeDetails();
            return this.dataService.getNodeDetails(this.node, this.path, this.revision);
          }
        ),
        merge(this.paramsSetManually.pipe((set) => {
          if (this.node) {
            this.parseNodeDetails();
            return this.dataService.getNodeDetails(this.node, this.path, this.revision);
          } else {
            return of(null);
          }
        })),
        takeUntil(this.componentDestroyed)
      )
      .subscribe(
        result => {
          if (result) {
            this.parseResult(result);
          }
        },
        err => {
          console.log('error', err);
          this.error = err;
        }
      );
  }




  ngOnDestroy(): void {
    this.componentDestroyed.next();
  }


  private parseResult(input: any[]) {
    let result = `<i>// From: ${this.node}@${this.revision}</i>\n\n`;
    result += `<b>${this.nodeType}</b> ${this.nodeName} {\n`;

    input.forEach(o => {
      Object.keys(o).forEach(key => {
        result += `\t<b>${key}</b> `;
        if (o[key]['has_children']) {
          result += `${o[key]['value']} {\n\t\t...\n\t}\n`;
        } else {
          if (o[key]['value'].indexOf(' ') !== -1) {
            result += `"${o[key]['value']}";\n`;
          } else {
            result += `${o[key]['value']};\n`;
          }
        }
      });
    });

    result += `}`;


    this.resultStr = result;

  }

  private parseNodeDetails() {
    const pathArr = this.path.split('/');
    const lastPathElemArr = pathArr[pathArr.length - 1].split('?');
    const nodeNameArr = lastPathElemArr[0].split(':');
    this.nodeName = nodeNameArr.length > 1 ? nodeNameArr[nodeNameArr.length - 1] : nodeNameArr[0];
    this.nodeType = lastPathElemArr[lastPathElemArr.length - 1];
  }

  onCloseError() {

  }
}
