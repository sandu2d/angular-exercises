import { Injectable } from '@angular/core';
import RaceModel from './models/race.model';

@Injectable({
  providedIn: 'root'
})

export class RaceService {

  races: Array<RaceModel>;

  constructor() {
    this.races = [
      {name: 'Lyon'},
      {name: 'Los Angeles'},
      {name: 'Sydney'},
      {name: 'Tokyo'},
      {name: 'Casablanca'}
    ];
  }

  list() {
    return this.races;
  }
}
