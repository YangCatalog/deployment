import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YcValidationsService {

  constructor() { }

  getNumberValidation(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      return (control.value && (!Number(control.value) && control.value !== '0' )) ? {'notNumber': {value: control.value}} : null;
    };
  }


}
