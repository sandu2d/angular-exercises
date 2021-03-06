import { Component, OnInit } from '@angular/core';
import { RaceModel } from '../models/race.model';
import { ActivatedRoute } from '@angular/router';
import { RaceService } from '../race.service';
import { PonyModel } from '../models/pony.model';

@Component({
  selector: 'pr-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css']
})
export class BetComponent implements OnInit {

  raceModel: RaceModel;
  betFailed = false;

  constructor(private route: ActivatedRoute, private raceService: RaceService) { }

  ngOnInit() {
    this.raceModel = this.route.snapshot.data.race;
  }

  betOnPony(pony: PonyModel) {
    if (pony.id === this.raceModel.betPonyId) {
      this.raceService.cancelBet(this.raceModel.id).subscribe(() => {
        this.raceModel.betPonyId = null;
      },
      () => {
        this.betFailed = true;
      });
    } else {
      this.raceService.bet(this.raceModel.id, pony.id).subscribe(race => {
        this.raceModel = race;
      },
      () => {
        this.betFailed = true;
      });
    }
  }

  isPonySelected(pony: PonyModel) {
    return pony.id === this.raceModel.betPonyId;
  }
}
