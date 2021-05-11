import { Injectable } from '@angular/core';
import { DataService } from '../../core/data.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrivateService extends DataService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getPrivateJson(): Observable<any> {
    return this.customGet('private/private.json');
  }

  loadData(jsonFile: string): Observable<any> {
    return this.customGet('private/' + jsonFile);

  }

  loadAndTransformObjData(jsonFile: string): Observable<any> {
    return this.customGet('private/' + jsonFile).pipe(
      map(response => this.transformObjDataToRows(response))
    );

  }

  loadAndTransformRfcObjData(jsonFile: string): Observable<any> {
    return this.customGet('private/' + jsonFile).pipe(
      map(response => Object.keys(response).map(key => [key, response[key]]))
    );

  }

  loadAndTransformStatisticsObjData(jsonFile: string): Observable<any> {
    return this.customGet('private/' + jsonFile).pipe(
      map(response => Object.keys(response).map(key => [key].concat(Object.keys(response[key]).map(key2 => response[key][key2]))))
    );

  }

  loadAndGetStatisticsForOneType(jsonFile: string, type: string): Observable<any> {
    return this.customGet('private/' + jsonFile).pipe(
      map(response => response[type])
    );

  }

  private transformObjDataToRows(objData: any) {
    const result = Object.keys(objData).map(key => {
      objData[key].unshift(key);
      return objData[key];
    });
    console.log('result, ', result);
    return result;
  }
}
