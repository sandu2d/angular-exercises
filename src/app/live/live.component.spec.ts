import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { LiveComponent } from './live.component';
import { RaceService } from '../race.service';
import { PonyComponent } from '../pony/pony.component';
import { FromNowPipe } from '../from-now.pipe';

describe('LiveComponent', () => {
  const fakeRaceService = jasmine.createSpyObj<RaceService>('RaceService', ['get', 'live']);
  fakeRaceService.get.and.returnValue(
    of({
      id: 1,
      name: 'Lyon',
      ponies: [],
      startInstant: '2016-02-18T08:02:00Z'
    })
  );
  fakeRaceService.live.and.returnValue(of([]));
  const fakeActivatedRoute = { snapshot: { paramMap: convertToParamMap({ raceId: 1 }) } };

  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [LiveComponent, PonyComponent, FromNowPipe],
      providers: [{ provide: RaceService, useValue: fakeRaceService }, { provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    })
  );

  it('should display the title', () => {
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
  });

  it('should subscribe to the live observable', () => {
    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();
    const liveComponent: LiveComponent = fixture.componentInstance;

    expect(fakeRaceService.live).toHaveBeenCalledWith(1);
    expect(liveComponent.poniesWithPosition)
      .withContext('poniesWithPosition should be initialized in the subscribe')
      .not.toBeNull();
    expect(liveComponent.positionSubscription)
      .withContext('positionSubscription should store the subscription')
      .not.toBeNull();
  });

  it('should unsubscribe on destruction', () => {
    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();
    const liveComponent: LiveComponent = fixture.componentInstance;

    spyOn(liveComponent.positionSubscription, 'unsubscribe');

    liveComponent.ngOnDestroy();

    expect(liveComponent.positionSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should display a div with a pony component per pony', () => {
    const fixture = TestBed.createComponent(LiveComponent);
    fixture.detectChanges();

    const liveComponent: LiveComponent = fixture.componentInstance;
    liveComponent.poniesWithPosition = [
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 10 },
      { id: 2, name: 'Awesome Fridge', color: 'Green', position: 40 }
    ];

    fixture.detectChanges();

    const element = fixture.nativeElement;
    const divWithPonies = element.querySelectorAll('div.pony-wrapper');
    expect(divWithPonies.length)
      .withContext('You should display a `div` with a class `pony-wrapper` for each pony')
      .toBe(2);

    const debugElement = fixture.debugElement;
    const ponyComponents = debugElement.queryAll(By.directive(PonyComponent));
    expect(ponyComponents)
      .withContext('You should display a `PonyComponent` for each pony')
      .not.toBeNull();
    expect(ponyComponents.length)
      .withContext('You should display a `PonyComponent` for each pony')
      .toBe(2);

    const sunnySunday = ponyComponents[0];
    expect(sunnySunday.componentInstance.isRunning)
      .withContext('Each pony should be running (use the `isRunning` input)')
      .toBeTruthy();

    const sunnySundayDiv = divWithPonies[0];
    expect(sunnySundayDiv.getAttribute('style')).toBe(
      'margin-left: 0%;',
      'The `margin-left` style should match the position of the pony in percent minus 10'
    );
  });
});
