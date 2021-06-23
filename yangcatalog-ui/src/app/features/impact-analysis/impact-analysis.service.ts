import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../core/data.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ImpactAnalysisModel } from './impact-analysis-visualisation/models/impact-analysis-model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImpactAnalysisService extends DataService {


  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getImpactAnalysis(moduleName: string, allowRfc: boolean, allowSubmodules: boolean, revision?: string): Observable<ImpactAnalysisModel> {

    /*
    'name': 'foo',
    'revision': 'bar',
    'organizations': ['foo', 'bar'],
    'allow-rfc': true/false,
    'allow-submodules': true/false,
    'graph-direction': ['dependents', 'dependencies'] // tu nemoze byt nic ine len jedno z tohoto alebo oboje
     */

    const input = {
      name: moduleName,
      organizations: [],
      'allow-rfc': allowRfc,
      'allow-submodules': allowSubmodules,
      'graph-direction': ['dependents', 'dependencies']
    };
    if (revision) {
      input['revision'] = revision;
    }

    return this.post('api/yang-search/v2/impact-analysis', input).pipe(
      map(impactData => new ImpactAnalysisModel(impactData))
    );
  }

  getModuleAutocomplete(searchStr: string): Observable<any> {
    return this.customGet('api/yang-search/v2/completions/module/' + searchStr);
  }

}
