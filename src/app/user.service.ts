import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiURL = 'http://ponyracer.ninja-squad.com';

  constructor(private http: HttpClient) { }

  register(login: string, password: string, birthYear: number): Observable<any> {
    return this.http.post(this.apiURL + '/api/users', {
      login, password, birthYear
    });
  }
}
