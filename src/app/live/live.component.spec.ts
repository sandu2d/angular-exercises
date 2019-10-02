import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Subject, of, EMPTY } from 'rxjs';

import { LiveComponent } from './live.component';
import { RaceService } from '../race.service';
import { PonyWithPositionModel } from '../models/pony.model';
import { RaceModel } from '../models/race.model';
import { PonyComponent } from '../pony/pony.component';
import { FromNowPipe } from '../from-now.pipe';

describe('LiveComponent', () => {
  const fakeRaceService = jasmine.createSpyObj<RaceService>('RaceService', ['get', 'live']);

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [LiveComponent, PonyComponent, FromNowPipe],
      providers: [{ provide: RaceService, useValue: fakeRaceService }]
    })
  );

  beforeEach(() => {
    fakeRaceService.get.calls.reset();
    fakeRaceService.live.calls.reset();
  });

  it('should initialize the array of positions with an empty array', () => {
    const fakeActivatedRoute: ActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot.params = { raceId: 1 };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'PENDING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    fakeRaceService.live.and.returnValue(of([]));

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    expect(liveComponent.poniesWithPosition)
      .withContext('poniesWithPosition should be initialized with an empty array')
      .not.toBeUndefined();
    expect(liveComponent.poniesWithPosition).toEqual([]);
  });

  it('should subscribe to the live observable if the race is PENDING', async(() => {
    const fakeActivatedRoute: ActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot.params = { raceId: 1 };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'PENDING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    fakeRaceService.live.and.returnValue(EMPTY);

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    expect(fakeRaceService.get).toHaveBeenCalledWith(1);
    expect(liveComponent.raceModel).toBe(race);
    expect(fakeRaceService.live).toHaveBeenCalledWith(1);
    expect(liveComponent.positionSubscription)
      .withContext('positionSubscription should store the subscription')
      .not.toBeNull();
  }));

  it('should subscribe to the live observable if the race is RUNNING', async(() => {
    const fakeActivatedRoute: ActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot.params = { raceId: 1 };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'RUNNING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    fakeRaceService.live.and.returnValue(of([{ id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 0 }]));

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    expect(fakeRaceService.get).toHaveBeenCalledWith(1);
    expect(liveComponent.raceModel).toBe(race);
    expect(fakeRaceService.live).toHaveBeenCalledWith(1);
    expect(liveComponent.positionSubscription)
      .withContext('positionSubscription should store the subscription')
      .not.toBeNull();
    expect(liveComponent.poniesWithPosition.length)
      .withContext('poniesWithPositions should store the positions')
      .toBe(1);
  }));

  it('should not subscribe to the live observable if the race is FINISHED', async(() => {
    const fakeActivatedRoute: ActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot.params = { raceId: 1 };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'FINISHED',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    fakeRaceService.live.and.returnValue(EMPTY);

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    expect(fakeRaceService.get).toHaveBeenCalledWith(1);
    expect(liveComponent.raceModel).toBe(race);
    expect(fakeRaceService.live).not.toHaveBeenCalledWith(1);
    expect(liveComponent.positionSubscription)
      .withContext('positionSubscription should store the subscription')
      .not.toBeNull();
  }));

  it('should change the race status once the race is RUNNING', async(() => {
    const fakeActivatedRoute: ActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot.params = { raceId: 1 };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'PENDING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    positions.next([{ id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 0 }]);
    expect(liveComponent.poniesWithPosition.length)
      .withContext('poniesWithPositions should store the positions')
      .toBe(1);
    expect(liveComponent.raceModel.status)
      .withContext('The race status should change to RUNNING once we receive positions')
      .toBe('RUNNING');
  }));

  it('should switch the error flag if an error occurs', async(() => {
    const fakeActivatedRoute: ActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot.params = { raceId: 1 };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'RUNNING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    positions.error(new Error('Oops'));
    expect(liveComponent.error)
      .withContext('You should store that an error occurred in the `error` field')
      .toBeTruthy();
  }));

  it('should unsubscribe on destruction', async(() => {
    const fakeActivatedRoute: ActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot.params = { raceId: 1 };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'RUNNING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    spyOn(liveComponent.positionSubscription, 'unsubscribe');

    liveComponent.ngOnDestroy();

    expect(liveComponent.positionSubscription.unsubscribe).toHaveBeenCalled();
  }));

  it('should tidy things up when the race is over', async(() => {
    const fakeActivatedRoute: ActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot.params = { raceId: 1 };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'RUNNING',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z',
      betPonyId: 1
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const liveComponent = new LiveComponent(fakeRaceService, fakeActivatedRoute);
    liveComponent.ngOnInit();

    positions.next([
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 100 },
      { id: 2, name: 'Pinkie Pie', color: 'GREEN', position: 101 },
      { id: 3, name: 'Awesome Fridge', color: 'YELLOW', position: 97 }
    ]);
    expect(liveComponent.poniesWithPosition.length)
      .withContext('poniesWithPositions should store the positions')
      .toBe(3);
    expect(liveComponent.winners)
      .withContext('The winners should be undefined until the race is over')
      .toBeUndefined();
    expect(liveComponent.betWon)
      .withContext('The bet status should be undefined until the race is over')
      .toBeUndefined();

    positions.complete();
    expect(liveComponent.raceModel.status)
      .withContext('The race status should change to FINISHED once the race is over')
      .toBe('FINISHED');
    expect(liveComponent.winners)
      .withContext('The winners should be not undefined once the race is over')
      .not.toBeUndefined();
    expect(liveComponent.winners.length)
      .withContext('The winners should contain all the ponies that won the race')
      .toBe(2);
    expect(liveComponent.winners.map(pony => pony.id)).toEqual([1, 2], 'The winners should contain all the ponies that won the race');
    expect(liveComponent.betWon)
      .withContext('The bet status should not be undefined until the race is over')
      .not.toBeUndefined();
    expect(liveComponent.betWon)
      .withContext('The bet status should true if the player won the bet')
      .toBeTruthy();
  }));

  it('should display the pending race', () => {
    const fakeActivatedRoute: ActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot.params = { raceId: 1 };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'PENDING',
      ponies: [
        { id: 1, name: 'Sunny Sunday', color: 'BLUE' },
        { id: 2, name: 'Pinkie Pie', color: 'GREEN' },
        { id: 3, name: 'Awesome Fridge', color: 'YELLOW' }
      ],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const title = element.querySelector('h1');
    expect(title)
      .withContext('The template should display an h1 element with the race name inside')
      .not.toBeNull();
    expect(title.textContent)
      .withContext('The template should display an h1 element with the race name inside')
      .toContain('Lyon');
    const liveRace = element.querySelector('#live-race');
    expect(liveRace.textContent).toContain('The race will start');

    const debugElement = fixture.debugElement;
    const ponyComponents = debugElement.queryAll(By.directive(PonyComponent));
    expect(ponyComponents)
      .withContext('You should display a `PonyComponent` for each pony')
      .not.toBeNull();
    expect(ponyComponents.length)
      .withContext('You should display a `PonyComponent` for each pony')
      .toBe(3);

    const sunnySunday = ponyComponents[0];
    expect(sunnySunday.componentInstance.isRunning)
      .withContext('The ponies should not be running')
      .toBeFalsy();
  });

  it('should display the running race', () => {
    const fakeActivatedRoute: ActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot.params = { raceId: 1 };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'PENDING',
      ponies: [
        { id: 1, name: 'Sunny Sunday', color: 'BLUE' },
        { id: 2, name: 'Pinkie Pie', color: 'GREEN' },
        { id: 3, name: 'Awesome Fridge', color: 'YELLOW' }
      ],
      startInstant: '2016-02-18T08:02:00Z'
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const title = element.querySelector('h1');
    expect(title)
      .withContext('The template should display an h1 element with the race name inside')
      .not.toBeNull();
    expect(title.textContent)
      .withContext('The template should display an h1 element with the race name inside')
      .toContain('Lyon');

    positions.next([
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 10 },
      { id: 2, name: 'Pinkie Pie', color: 'GREEN', position: 10 },
      { id: 3, name: 'Awesome Fridge', color: 'YELLOW', position: 9 }
    ]);
    fixture.detectChanges();

    const debugElement = fixture.debugElement;
    const ponyComponents = debugElement.queryAll(By.directive(PonyComponent));
    expect(ponyComponents)
      .withContext('You should display a `PonyComponent` for each pony')
      .not.toBeNull();
    expect(ponyComponents.length)
      .withContext('You should display a `PonyComponent` for each pony')
      .toBe(3);

    const sunnySunday = ponyComponents[0];
    expect(sunnySunday.componentInstance.isRunning)
      .withContext('The ponies should be running')
      .toBeTruthy();
  });

  it('should display the finished race', () => {
    const fakeActivatedRoute: ActivatedRoute = TestBed.get(ActivatedRoute);
    fakeActivatedRoute.snapshot.params = { raceId: 1 };
    const race = {
      id: 1,
      name: 'Lyon',
      status: 'PENDING',
      ponies: [
        { id: 1, name: 'Sunny Sunday', color: 'BLUE' },
        { id: 2, name: 'Pinkie Pie', color: 'GREEN' },
        { id: 3, name: 'Awesome Fridge', color: 'YELLOW' }
      ],
      startInstant: '2016-02-18T08:02:00Z',
      betPonyId: 1
    } as RaceModel;
    fakeRaceService.get.and.returnValue(of(race));
    const positions = new Subject<Array<PonyWithPositionModel>>();
    fakeRaceService.live.and.returnValue(positions);

    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const title = element.querySelector('h1');
    expect(title)
      .withContext('The template should display an h1 element with the race name inside')
      .not.toBeNull();
    expect(title.textContent)
      .withContext('The template should display an h1 element with the race name inside')
      .toContain('Lyon');

    positions.next([
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 101 },
      { id: 2, name: 'Pinkie Pie', color: 'GREEN', position: 100 },
      { id: 3, name: 'Awesome Fridge', color: 'YELLOW', position: 9 }
    ]);
    positions.complete();
    fixture.detectChanges();

    // won the bet!
    const debugElement = fixture.debugElement;
    const ponyComponents = debugElement.queryAll(By.directive(PonyComponent));
    expect(ponyComponents)
      .withContext('You should display a `PonyComponent` for each winner')
      .not.toBeNull();
    expect(ponyComponents.length)
      .withContext('You should display a `PonyComponent` for each pony')
      .toBe(2);

    const sunnySunday = ponyComponents[0];
    expect(sunnySunday.componentInstance.isRunning)
      .withContext('The ponies should be not running')
      .toBeFalsy();

    expect(element.textContent).toContain('You won your bet!');

    // lost the bet...
    fixture.componentInstance.betWon = false;
    fixture.detectChanges();
    expect(element.textContent).toContain('You lost your bet.');

    // no winners (race was already over)
    fixture.componentInstance.winners = [];
    fixture.detectChanges();
    expect(element.textContent).toContain('The race is over.');

    // an error occurred
    fixture.componentInstance.error = true;
    fixture.detectChanges();
    const alert = element.querySelector('div.alert.alert-danger');
    expect(alert.textContent).toContain('A problem occurred during the live.');
  });
});
