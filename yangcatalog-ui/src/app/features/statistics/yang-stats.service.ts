import { Injectable } from '@angular/core';
import { DataService } from '../../core/data.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { YangStatsModel } from './models/yang-stats-model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class YangStatsService extends DataService {

  constructor(httpClient: HttpClient) {
    super(httpClient);

  }

}
