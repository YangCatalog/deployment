import { Injectable } from '@angular/core';
import { DataService } from '../../core/data.service';
import { HttpClient } from '@angular/common/http';
import { SearchInput } from './models/search-input';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YangSearchService extends DataService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getSearchResults(searchInput: SearchInput): Observable<any> {
    return this.post('api/yang-search/v2/search', searchInput);
  }

  getNodeDetails(node: string, path: string, revision: string): Observable<any> {
    return this.customGet(encodeURIComponent('api/yang-search/v2/show-node/' + node  + path + '/' + revision));
  }
}
