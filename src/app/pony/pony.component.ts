import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { PonyModel } from '../models/pony.model';

@Component({
  selector: 'pr-pony',
  templateUrl: './pony.component.html',
  styleUrls: ['./pony.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PonyComponent implements OnInit {
  @Input() ponyModel: PonyModel;
  @Input() isRunning: boolean;
  @Input() isBoosted: boolean;
  @Output() readonly ponyClicked = new EventEmitter<PonyModel>();

  constructor() {}

  ngOnInit() {}

  getPonyImageUrl() {
    return `assets/images/pony-${this.ponyModel.color.toLowerCase()}${this.isBoosted ? '-rainbow' : this.isRunning ? '-running' : ''}.gif`;
  }

  clicked() {
    this.ponyClicked.emit(this.ponyModel);
  }
}
