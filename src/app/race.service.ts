import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RaceService {
  apiURL = 'http://ponyracer.ninja-squad.com';

  constructor(private http: HttpClient) {}

  list(): Observable<any> {
    return this.http.get(this.apiURL + '/api/races?status=PENDING');
  }
}
