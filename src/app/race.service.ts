import { Injectable } from '@angular/core';
import RaceModel from './models/race.model';

@Injectable({
  providedIn: 'root'
})

export class RaceService {

  races: Array<RaceModel>;

  constructor() {
    this.races = [{ name: 'Tokyo' }, { name: 'Paris' }];
  }

  list() {
    return this.races;
  }
}
