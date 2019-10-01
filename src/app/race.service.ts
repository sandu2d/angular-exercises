import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RaceService {

  constructor(private http: HttpClient) {}

  list(): Observable<any> {
    return this.http.get(environment.baseUrl + '/api/races?status=PENDING');
  }

  bet(raceId: number, ponyId: number): Observable<any> {
    return this.http.post(environment.baseUrl + '/api/races/' + raceId + '/bets', { ponyId });
  }

  get(id: number): Observable<any> {
    return this.http.get(environment.baseUrl + '/api/races/' + id);
  }
}
