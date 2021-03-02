import { Injectable } from '@angular/core';
import { DataServiceService } from '../core/data-service.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class YangValidatorService extends DataServiceService {


  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  testGet() {
    return this.customGet('yangvalidator/api/rfc/7223');
  }

}
