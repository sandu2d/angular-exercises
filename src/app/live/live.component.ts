import { Component, OnInit, OnDestroy } from '@angular/core';
import { RaceModel } from '../models/race.model';
import { RaceService } from '../race.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PonyWithPositionModel } from '../models/pony.model';
import { filter, tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'pr-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit, OnDestroy {

  raceModel: RaceModel;
  positionSubscription: Subscription;
  poniesWithPosition: Array<PonyWithPositionModel> = [];
  error = false;
  winners: Array<PonyWithPositionModel>;
  betWon: boolean;

  constructor(private raceService: RaceService, private route: ActivatedRoute) { }

  ngOnInit() {
    const raceId = Number(this.route.snapshot.paramMap.get('raceId'));

    this.positionSubscription = this.raceService
      .get(raceId)
      .pipe(
        tap(race => this.raceModel = race),
        filter(race => race.status !== 'FINISHED'),
        switchMap(race => this.raceService.live(race.id))
      )
      .subscribe(
        positions => {
          this.poniesWithPosition = positions;
          this.raceModel.status = 'RUNNING';
        },
        error => this.error = true,
        () => {
          this.raceModel.status = 'FINISHED';
          this.winners = this.poniesWithPosition.filter(pony => pony.position >= 100);
          this.betWon = this.winners.some(pony => pony.id === this.raceModel.betPonyId);
        }
      );
  }

  ngOnDestroy() {
    this.positionSubscription.unsubscribe();
  }
}
