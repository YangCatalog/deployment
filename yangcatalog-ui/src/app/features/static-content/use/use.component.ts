import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'yc-use',
  templateUrl: './use.component.html',
  styleUrls: ['./use.component.scss']
})
export class UseComponent implements OnInit {
  myBasePath = environment.WEBROOT_BASE_URL;

  constructor() { }

  ngOnInit(): void {
  }

}
