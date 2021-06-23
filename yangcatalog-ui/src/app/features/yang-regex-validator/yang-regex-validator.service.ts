import { Injectable } from '@angular/core';
import { DataService } from '../../core/data.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class YangRegexValidatorService extends DataService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }


  getYangcatalogValidation(pattern: string, inverted: string, content: string, patternNb: number): Observable<any> {
    return this.post('yangre/v1/yangre', {inverted, pattern_nb: patternNb, pattern, content})
      .pipe(
        map(response => {
          return {
            result: response['yangre_result'],
            output: response['yangre_output']
          };
        })
      );
  }

  getW3cValidation(pattern: string, inverted: string, content: string, patternNb: number): Observable<any> {
    return this.post('yangre/v1/w3c', {inverted, pattern_nb: patternNb, pattern, content})
      .pipe(
        map(response => {
          return {
            result: response['w3cgrep_result'],
            output: response['w3cgrep_output']
          };
        })
      );
  }

}
