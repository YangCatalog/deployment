import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'yc-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() footerNgStyle = {};
  @Input() shadowClass = '';
  myBasePath = environment.WEBROOT_BASE_URL;

  constructor() { }

  ngOnInit(): void {
  }

}
