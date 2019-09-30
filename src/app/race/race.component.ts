import { Component, OnInit, Input } from '@angular/core';
import { RaceModel } from '../models/race.model';
import { FromNowPipe } from '../from-now.pipe';

@Component({
  selector: 'pr-race',
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.css'],
  providers: [FromNowPipe]
})
export class RaceComponent implements OnInit {
  @Input() raceModel: RaceModel;

  constructor(private fromNow: FromNowPipe) {}

  ngOnInit() {}

  getStartDateTime() {
    return this.fromNow.transform(this.raceModel.startInstant);
  }
}
