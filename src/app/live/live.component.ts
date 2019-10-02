import { Component, OnInit, OnDestroy } from '@angular/core';
import { RaceModel } from '../models/race.model';
import { RaceService } from '../race.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PonyWithPositionModel } from '../models/pony.model';

@Component({
  selector: 'pr-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit, OnDestroy {

  raceModel: RaceModel;
  positionSubscription: Subscription;
  poniesWithPosition: Array<PonyWithPositionModel>;

  constructor(private raceService: RaceService, private route: ActivatedRoute) { }

  ngOnInit() {
    const raceId = Number(this.route.snapshot.paramMap.get('raceId'));

    this.raceService.get(raceId).subscribe(race => {
      this.raceModel = race;
    });

    this.positionSubscription = this.raceService.live(raceId).subscribe(ponies => {
      this.poniesWithPosition = ponies;
    });
  }

  ngOnDestroy() {
    this.positionSubscription.unsubscribe();
  }
}
