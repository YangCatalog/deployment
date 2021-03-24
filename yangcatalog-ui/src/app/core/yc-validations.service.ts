import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class YcValidationsService {

  constructor() { }

  getNumberValidation(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      console.log('validating', control.value);
      return (control.value && (!Number(control.value) && control.value !== '0' )) ? {'notNumber': {value: control.value}} : null;
    };
  }

}
