import { Component, Input, OnInit } from '@angular/core';
import { ValidationOutput } from '../models/validation-output';

@Component({
  selector: 'yc-validation-result',
  templateUrl: './validation-result.component.html',
  styleUrls: ['./validation-result.component.scss']
})
export class ValidationResultComponent implements OnInit {

  @Input() validationOutput: ValidationOutput;


  constructor() { }

  ngOnInit(): void {
  }

}
