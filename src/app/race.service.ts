import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { PonyWithPositionModel } from './models/pony.model';
import { take, map } from 'rxjs/operators';

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

  cancelBet(raceId: number) {
    return this.http.delete(environment.baseUrl + '/api/races/' + raceId + '/bets');
  }

  live(raceId: number): Observable<Array<PonyWithPositionModel>> {
    return interval(1000).pipe(
      take(101),
      map(position => {
        return [{
          id: 1,
          name: 'Superb Runner',
          color: 'BLUE',
          position
        }, {
          id: 2,
          name: 'Awesome Fridge',
          color: 'GREEN',
          position
        }, {
          id: 3,
          name: 'Great Bottle',
          color: 'ORANGE',
          position
        }, {
          id: 4,
          name: 'Little Flower',
          color: 'YELLOW',
          position
        }, {
          id: 5,
          name: 'Nice Rock',
          color: 'PURPLE',
          position
        }];
      })
    );
  }
}
