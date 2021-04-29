import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from './account.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'yc-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  form: FormGroup;
  error: any;
  progress = false;
  result: any;

  private componentDestroyed: Subject<void> = new Subject<void>();

  constructor(private fb: FormBuilder, private dataService: AccountService) {
  }

  ngOnInit(): void {

    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
      email: ['', Validators.required],
      company: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next();
  }


  onCloseError() {
    this.error = null;
  }

  onCreateAccountClick() {
    if (this.form.invalid) {
      return;
    }

    this.result = '';
    this.error = null;
    this.progress = true;

    this.dataService.createUser({
      username: this.form.get('username').value,
      password: this.form.get('password').value,
      'password-confirm': this.form.get('passwordConfirm').value,
      email: this.form.get('email').value,
      company: this.form.get('company').value,
      'first-name': this.form.get('firstName').value,
      'last-name': this.form.get('lastName').value,
    }).pipe(
      finalize(() => this.progress = false),
      takeUntil(this.componentDestroyed)
    ).subscribe(
      ok => {
        this.result = 'User was successfuly created';
        this.form.reset();
      },
      err => {
        console.log(err);
        this.error = err;
      }
    );
  }
}
