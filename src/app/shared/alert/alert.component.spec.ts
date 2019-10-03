import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { AlertComponent } from './alert.component';

@Component({
  selector: 'pr-fake',
  template: `
    <pr-alert (close)="closed = true; event = $event">Hello</pr-alert>
  `
})
class FakeComponent {
  closed = false;
  event: Event = null;
}

describe('AlertComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [FakeComponent, AlertComponent]
    })
  );

  it('should be created with default values', () => {
    const fixture = TestBed.createComponent(AlertComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    expect(component.type)
      .withContext('The type input should be `warning` by default')
      .toBe('warning');
    expect(component.dismissible)
      .withContext('The dismissible input should be `true` by default')
      .toBe(true);
  });

  it('should have a content', () => {
    const fixture = TestBed.createComponent(FakeComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement;

    expect(element.textContent)
      .withContext('The AlertComponent should use `ng-content`')
      .toContain('Hello');
  });

  it('should compute the classes to apply', () => {
    const component = new AlertComponent();

    expect(component.alertClasses)
      .withContext('The alertClasses getter should depend on the type')
      .toBe('alert alert-warning');

    component.type = 'danger';
    expect(component.alertClasses)
      .withContext('The alertClasses getter should depend on the type')
      .toBe('alert alert-danger');
  });

  it('should apply the classes on the root element', () => {
    const fixture = TestBed.createComponent(FakeComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const div = element.querySelector('div');
    expect(div.className)
      .withContext('The alertClasses should be applied on the root element')
      .toContain('alert alert-warning');
  });

  it('should emit a close event', () => {
    const fixture = TestBed.createComponent(FakeComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    element.querySelector('button').dispatchEvent(new Event('click'));
    fixture.detectChanges();

    const component = fixture.componentInstance;
    expect(component.closed)
      .withContext('You should emit an event on close')
      .toBe(true);
    expect(component.event)
      .withContext('The close event should emit a void event')
      .toBeUndefined();
  });
});
