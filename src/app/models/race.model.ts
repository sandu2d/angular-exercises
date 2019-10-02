import { PonyModel, PonyWithPositionModel } from './pony.model';

export interface RaceModel {
  id: number;
  name: string;
  ponies: Array<PonyModel>;
  startInstant: string;
  betPonyId?: number;
  status?: 'PENDING' | 'RUNNING' | 'FINISHED';
}

export interface LiveRaceModel {
  ponies: Array<PonyWithPositionModel>;
  status: 'PENDING' | 'RUNNING' | 'FINISHED';
}
