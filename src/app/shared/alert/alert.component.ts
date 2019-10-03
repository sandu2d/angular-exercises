import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'pr-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Output() readonly close: EventEmitter<void> = new EventEmitter<void>();
  @Input() type = 'warning';
  @Input() dismissible = true;

  constructor() { }

  ngOnInit() {
  }

  closeHandler() {
    this.close.emit();
  }

  get alertClasses(): string {
    return `alert alert-${this.type}`;
  }

}
