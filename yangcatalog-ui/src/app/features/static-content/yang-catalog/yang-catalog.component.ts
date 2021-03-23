import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'yc-yang-catalog',
  templateUrl: './yang-catalog.component.html',
  styleUrls: ['./yang-catalog.component.scss']
})
export class YangCatalogComponent implements OnInit {

  myBasePath = environment.WEBROOT_BASE_URL;

  constructor() { }

  ngOnInit() {
  }

}
