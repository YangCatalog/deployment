import { Injectable } from '@angular/core';
import { DataService } from '../../../core/data.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends DataService {

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  createUser(input: any): Observable<any> {
    return this.post('api/register-user', input);
  }

}
