import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RaceModel } from './models/race.model';
import { Observable } from 'rxjs';
import { RaceService } from './race.service';

@Injectable({
  providedIn: 'root'
})
export class RacesResolverService implements Resolve<Array<RaceModel>> {

  constructor(private raceService: RaceService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<RaceModel>> {
    const status = route.routeConfig.path.toUpperCase() as 'PENDING' | 'RUNNING' | 'FINISHED';
    return this.raceService.list(status);
  }
}
