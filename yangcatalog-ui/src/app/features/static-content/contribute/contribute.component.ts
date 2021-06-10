import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'yc-contribute',
  templateUrl: './contribute.component.html',
  styleUrls: ['./contribute.component.scss']
})
export class ContributeComponent implements OnInit {
  myBasePath = environment.WEBROOT_BASE_URL;

  constructor() { }

  ngOnInit() {
  }

}
