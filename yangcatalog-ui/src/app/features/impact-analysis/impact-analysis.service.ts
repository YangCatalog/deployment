import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../core/data.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImpactAnalysisService extends DataService {


  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getModuleAutocomplete(searchStr: string): Observable<any> {
    return this.customGet('api/yang-search/v2/completions/module/' + searchStr);
  }

}
