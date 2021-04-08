import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'yc-yang-regex-about',
  templateUrl: './yang-regex-about.component.html',
  styleUrls: ['./yang-regex-about.component.scss']
})
export class YangRegexAboutComponent implements OnInit {

  constructor(private modal: NgbActiveModal,
  ) {
  }

  ngOnInit(): void {
  }

  onCancelClick() {
    this.modal.dismiss();

  }
}
