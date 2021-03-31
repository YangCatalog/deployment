import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'yc-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() footerNgStyle = {};

  constructor() { }

  ngOnInit(): void {
  }

}
