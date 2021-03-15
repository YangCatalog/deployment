import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'yc-validation-error',
  templateUrl: './validation-error.component.html',
  styleUrls: ['./validation-error.component.scss']
})
export class ValidationErrorComponent implements OnInit {

  @Input() error: any;
  displayed = true;

  constructor() { }

  ngOnInit(): void {
  }

  onCloseError() {
    this.error = null;
  }
}
