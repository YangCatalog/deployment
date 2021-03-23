import { Injectable } from '@angular/core';
import { DataService } from '../../core/data.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ValidationOutput } from './models/validation-output';
import { map } from 'rxjs/operators';
import { ChosenMissingRevsInput } from './models/chosen-missing-revs-input';
import { isArray } from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class YangValidatorService extends DataService {


  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  validateRfcByNumber(rfcNumber: number): Observable<ValidationOutput> {
    return this.post('yangvalidator/v2/rfc', {
      rfc: rfcNumber,
      latest: false
    }).pipe(
      map(output => {
        if (output.hasOwnProperty('Error')) {
          throw new Error(output['Error']);
        } else {
          return new ValidationOutput(output['output']);
        }
      })
    );
  }

  validateByDraftName(draftName: string): Observable<ValidationOutput> {
    return this.post('yangvalidator/v2/draft', {
      draft: draftName,
      latest: false
    }).pipe(
      map(output => {
        if (output.hasOwnProperty('Error')) {
          throw new Error(output['Error']);
        } else {
          return new ValidationOutput(output['output']);
        }
      })
    );
  }

  preSetupFilesUpload(useLatest: boolean, getFromOptions: boolean): Observable<string> {
    return this.post('yangvalidator/v2/upload-files-setup', {
      latest: useLatest,
      'get-from-options': getFromOptions
    }).pipe(
      map(output => {
        return output['output']['cache'];
      })
    );
  }

  uploadPreSetFiles(cache: string, formData: FormData): Observable<any> {
    return this.post('yangvalidator/v2/validator/' + cache, formData)
      .pipe(
        map(output => {

          console.log('output', output);
          if (output.hasOwnProperty('Error')) {
            throw new Error(output['Error']);
          } else {
            return new ValidationOutput(output['output']);
          }
        })
      );
  }

  uploadPreSetDraftFile(cache: string, formData: FormData): Observable<any> {
    return this.post('yangvalidator/v2/draft-validator/' + cache, formData)
      .pipe(
        map(output => {
          console.log('output', output);
          if (output.hasOwnProperty('Error')) {
            throw new Error(output['Error']);
          } else if (output.hasOwnProperty('output') && output['output'].hasOwnProperty('error')) {
            throw new Error(output['output']['error']);
          } else {
            return new ValidationOutput(output[0]['output']);

          }
        })
      );
  }


  validateRfcByNumberWithLatestRevisions(rfcNumber: number): Observable<ValidationOutput> {
    return this.post('yangvalidator/v2/rfc', {
      rfc: rfcNumber,
      latest: true
    }).pipe(
      map(output => {
        return new ValidationOutput(output['output']);
      })
    );
  }

  chooseMissingRevsForPreviousRequest(previousOutput: ValidationOutput, missingInput: ChosenMissingRevsInput): Observable<void> {
    return this.post('yangvalidator/v2/validate', missingInput).pipe(
      map(output => {
        previousOutput.setValidationOutputData(output['output']);
      })
    );
  }

}
