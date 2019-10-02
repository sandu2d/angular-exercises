import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

import { FinishedRacesComponent } from './finished-races.component';
import { RaceComponent } from '../../race/race.component';
import { PonyComponent } from '../../pony/pony.component';
import { FromNowPipe } from '../../from-now.pipe';

describe('FinishedRacesComponent', () => {
  const activatedRoute = {
    snapshot: {
      data: {
        races: [{ name: 'Lyon' }, { name: 'Los Angeles' }, { name: 'Sydney' }, { name: 'Tokyo' }, { name: 'Casablanca' }]
      }
    }
  };

  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [FinishedRacesComponent, RaceComponent, PonyComponent, FromNowPipe],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }]
    })
  );

  it('should display every race name in a title', () => {
    const fixture = TestBed.createComponent(FinishedRacesComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.races)
      .withContext('You need to have a field `races` initialized with 5 races')
      .not.toBeNull();
    expect(fixture.componentInstance.races.length)
      .withContext('You need to have a field `races` initialized with 5 races')
      .toBe(5);
    expect(fixture.componentInstance.races[0].name).toBe('Lyon');
    expect(fixture.componentInstance.races[1].name).toBe('Los Angeles');
    expect(fixture.componentInstance.races[2].name).toBe('Sydney');
    expect(fixture.componentInstance.races[3].name).toBe('Tokyo');
    expect(fixture.componentInstance.races[4].name).toBe('Casablanca');

    const debugElement = fixture.debugElement;
    const raceNames = debugElement.queryAll(By.directive(RaceComponent));
    expect(raceNames.length)
      .withContext('You should have five `RaceComponent` displayed')
      .toBe(5);
  });

  it('should not display a link to bet on a race', () => {
    const fixture = TestBed.createComponent(FinishedRacesComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement;
    const raceNames = element.querySelectorAll('a');
    expect(raceNames.length)
      .withContext('You must NOT have a link to go to the bet page for each race')
      .toBe(0);
  });
});
