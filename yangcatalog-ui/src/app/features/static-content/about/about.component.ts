import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'yc-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  myBaseUrl = environment.WEBROOT_BASE_URL;

  constructor() { }

  ngOnInit() {
  }

}
