import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription, interval, EMPTY } from 'rxjs';
import { bufferToggle, catchError, filter, finalize, groupBy, map, mergeMap, switchMap, throttleTime } from 'rxjs/operators';

import { RaceService } from '../race.service';
import { RaceModel } from '../models/race.model';
import { PonyWithPositionModel } from '../models/pony.model';

@Component({
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LiveComponent implements OnInit, OnDestroy {
  raceModel: RaceModel;
  poniesWithPosition: Array<PonyWithPositionModel> = [];
  positionSubscription: Subscription;
  error: boolean;
  winners: Array<PonyWithPositionModel> = [];
  betWon: boolean;
  clickSubject = new Subject<PonyWithPositionModel>();

  constructor(private ref: ChangeDetectorRef, private raceService: RaceService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.raceModel = this.route.snapshot.data.race;

    if (this.raceModel.status !== 'FINISHED') {
      this.positionSubscription = this.raceService
        .live(this.raceModel.id)
        .pipe(finalize(() => this.ref.markForCheck()))
        .subscribe(
          positions => {
            this.poniesWithPosition = positions;
            this.raceModel.status = 'RUNNING';
            this.ref.markForCheck();
          },
          error => (this.error = true),
          () => {
            this.raceModel.status = 'FINISHED';
            this.winners = this.poniesWithPosition.filter(pony => pony.position >= 100);
            this.betWon = this.winners.some(pony => pony.id === this.raceModel.betPonyId);
          }
        );
    }

    this.clickSubject
      .pipe(
        groupBy(pony => pony.id, pony => pony.id),
        mergeMap(obs => obs.pipe(bufferToggle(obs, () => interval(1000)))),
        filter(array => array.length >= 5),
        throttleTime(1000),
        map(array => array[0]),
        switchMap(ponyId => this.raceService.boost(this.raceModel.id, ponyId).pipe(catchError(() => EMPTY)))
      )
      .subscribe(() => {});
  }

  ngOnDestroy() {
    if (this.positionSubscription) {
      this.positionSubscription.unsubscribe();
    }
  }

  onClick(pony: PonyWithPositionModel) {
    this.clickSubject.next(pony);
  }

  ponyById(index: number, pony: PonyWithPositionModel): number {
    return pony.id;
  }
}
