import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { PonyWithPositionModel } from './models/pony.model';
import { map, takeWhile } from 'rxjs/operators';
import { WsService } from './ws.service';
import { LiveRaceModel, RaceModel } from './models/race.model';

@Injectable({
  providedIn: 'root'
})
export class RaceService {

  constructor(private http: HttpClient, private ws: WsService) {}

  list(status: 'PENDING' | 'RUNNING' | 'FINISHED'): Observable<Array<RaceModel>> {
    const params = { status };
    return this.http.get<Array<RaceModel>>(`${environment.baseUrl}/api/races`, { params });
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
    return this.ws.connect<LiveRaceModel>(`/race/${raceId}`).pipe(
      takeWhile(race => race.status !== 'FINISHED'),
      map(race => race.ponies)
    );
  }

  boost(raceId: number, ponyId: number): Observable<any> {
    return this.http.post(environment.baseUrl + '/api/races/' + raceId + '/boosts', { ponyId });
  }
}
