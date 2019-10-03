import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import * as moment from 'moment';

import { RacesModule } from '../races/races.module';
import { RaceService } from '../race.service';
import { BetComponent } from './bet.component';
import { PonyComponent } from '../pony/pony.component';
import { RaceModel } from '../models/race.model';
import { PonyModel } from '../models/pony.model';

describe('BetComponent', () => {
  const fakeRaceService = jasmine.createSpyObj<RaceService>('RaceService', ['bet', 'cancelBet']);
  const race = { id: 1, name: 'Paris' } as RaceModel;
  const fakeActivatedRoute = { snapshot: { data: { race } } };

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RacesModule, RouterTestingModule, NgbAlertModule],
      providers: [{ provide: RaceService, useValue: fakeRaceService }, { provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    })
  );

  it('should display a race name, its date and its ponies', () => {
    const fixture = TestBed.createComponent(BetComponent);
    fixture.detectChanges();

    // given a race in Paris with 5 ponies
    const betComponent = fixture.componentInstance;
    betComponent.raceModel = {
      id: 12,
      name: 'Paris',
      ponies: [
        { id: 1, name: 'Gentle Pie', color: 'YELLOW' },
        { id: 2, name: 'Big Soda', color: 'ORANGE' },
        { id: 3, name: 'Gentle Bottle', color: 'PURPLE' },
        { id: 4, name: 'Superb Whiskey', color: 'GREEN' },
        { id: 5, name: 'Fast Rainbow', color: 'BLUE' }
      ],
      startInstant: '2016-02-18T08:02:00Z'
    };

    // when triggering the change detection
    fixture.detectChanges();

    // then we should have the name and ponies displayed in the template
    const directives = fixture.debugElement.queryAll(By.directive(PonyComponent));
    expect(directives)
      .withContext('You should use the PonyComponent in your template to display the ponies')
      .not.toBeNull();
    expect(directives.length)
      .withContext('You should have five pony components in your template')
      .toBe(5);
    const element = fixture.nativeElement;
    const raceName = element.querySelector('h1');
    expect(raceName)
      .withContext('You need an h1 element for the race name')
      .not.toBeNull();
    expect(raceName.textContent)
      .withContext('The h1 element should contain the race name')
      .toContain('Paris');
    const startInstant = element.querySelector('p');
    expect(startInstant)
      .withContext('You should use a `p` element to display the start instant')
      .not.toBeNull();
    expect(startInstant.textContent)
      .withContext('You should use the `fromNow` pipe you created to format the start instant')
      .toBe(moment(betComponent.raceModel.startInstant).fromNow());
  });

  it('should trigger a bet when a pony is clicked', async(() => {
    const fixture = TestBed.createComponent(BetComponent);
    fixture.detectChanges();

    fakeRaceService.bet.and.returnValue(
      of({
        id: 12,
        name: 'Paris',
        ponies: [{ id: 1, name: 'Gentle Pie', color: 'YELLOW' }, { id: 2, name: 'Big Soda', color: 'ORANGE' }],
        startInstant: '2016-02-18T08:02:00Z',
        betPonyId: 1
      })
    );

    // given a race in Paris with 2 ponies
    const betComponent = fixture.componentInstance;
    betComponent.raceModel = {
      id: 12,
      name: 'Paris',
      ponies: [{ id: 1, name: 'Gentle Pie', color: 'YELLOW' }, { id: 2, name: 'Big Soda', color: 'ORANGE' }],
      startInstant: '2016-02-18T08:02:00Z'
    };
    fixture.detectChanges();

    // when we emit a `ponyClicked` event
    const directives = fixture.debugElement.queryAll(By.directive(PonyComponent));
    const gentlePie = directives[0].componentInstance;

    // then we should have placed a bet on the pony
    gentlePie.ponyClicked.subscribe(() => {
      expect(fakeRaceService.bet).toHaveBeenCalledWith(12, 1);
      expect(betComponent.raceModel.betPonyId)
        .withContext('You must store the response of the bet in the field `raceModel`')
        .toBe(1);
    });

    gentlePie.ponyClicked.emit(betComponent.raceModel.ponies[0]);
  }));

  it('should test if the pony is the one we bet on', () => {
    const fixture = TestBed.createComponent(BetComponent);
    const component = fixture.componentInstance;
    component.raceModel = {
      id: 12,
      name: 'Paris',
      ponies: [{ id: 1, name: 'Gentle Pie', color: 'YELLOW' }, { id: 2, name: 'Big Soda', color: 'ORANGE' }],
      startInstant: '2016-02-18T08:02:00Z',
      betPonyId: 1
    };
    const pony = { id: 1 } as PonyModel;

    const isSelected = component.isPonySelected(pony);

    expect(isSelected)
      .withContext('The `isPonySelected` method should return true if the pony is selected')
      .toBe(true);
  });

  it('should initialize the race with ngOnInit', () => {
    const fixture = TestBed.createComponent(BetComponent);
    const component = fixture.componentInstance;
    expect(component.raceModel).toBeUndefined();

    component.ngOnInit();

    expect(component.raceModel)
      .withContext('`ngOnInit` should initialize the `raceModel`')
      .not.toBeUndefined();
    expect(component.raceModel).toEqual(race);
  });

  it('should display an error message if bet failed', () => {
    const fixture = TestBed.createComponent(BetComponent);
    fakeRaceService.bet.and.callFake(() => throwError(new Error('Oops')));

    const component = fixture.componentInstance;
    component.raceModel = { id: 2 } as RaceModel;
    expect(component.betFailed).toBe(false);

    const pony = { id: 1 } as PonyModel;
    component.betOnPony(pony);

    expect(component.betFailed).toBe(true);

    fixture.detectChanges();

    const debugElement = fixture.debugElement;
    const message = debugElement.query(By.directive(NgbAlert));
    expect(message)
      .withContext('You should have an NgbAlert if the bet failed')
      .not.toBeNull();
    expect(message.nativeElement.textContent).toContain('The race is already started or finished');
    expect(message.componentInstance.type)
      .withContext('The alert should be a danger one')
      .toBe('danger');

    // close the alert
    message.componentInstance.closeHandler();
    fixture.detectChanges();
    expect(debugElement.query(By.directive(NgbAlert)))
      .withContext('The NgbAlert should be closable')
      .toBeNull();
  });

  it('should cancel a bet', () => {
    const fixture = TestBed.createComponent(BetComponent);
    fakeRaceService.cancelBet.and.returnValue(of(null));

    const component = fixture.componentInstance;
    component.raceModel = { id: 2, betPonyId: 1, name: 'Lyon', ponies: [], startInstant: '2016-02-18T08:02:00Z' };

    const pony = { id: 1 } as PonyModel;
    component.betOnPony(pony);

    expect(fakeRaceService.cancelBet).toHaveBeenCalledWith(2);
    expect(component.raceModel.betPonyId).toBeFalsy();
  });

  it('should display a message if canceling a bet fails', () => {
    const fixture = TestBed.createComponent(BetComponent);
    fixture.detectChanges();

    fakeRaceService.cancelBet.and.callFake(() => throwError(new Error('Oops')));

    const component = fixture.componentInstance;
    component.raceModel = { id: 2, betPonyId: 1, name: 'Lyon', ponies: [], startInstant: '2016-02-18T08:02:00Z' };
    expect(component.betFailed).toBe(false);

    const pony = { id: 1 } as PonyModel;
    component.betOnPony(pony);

    expect(fakeRaceService.cancelBet).toHaveBeenCalledWith(2);
    expect(component.raceModel.betPonyId).toBe(1);
    expect(component.betFailed).toBe(true);
  });

  it('should display a link to go to live', () => {
    const fixture = TestBed.createComponent(BetComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    component.raceModel = { id: 2, betPonyId: 1, name: 'Lyon', ponies: [], startInstant: '2016-02-18T08:02:00Z' };
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const button = element.querySelector('a[href="/races/2/live"]');
    expect(button)
      .withContext('You should have a link to go to the live with an href `/races/id/live`')
      .not.toBeNull();
    expect(button.textContent).toContain('Watch live!');
  });
});
