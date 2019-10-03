import { fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, Params, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';

import { RaceResolverService } from './race-resolver.service';
import { RaceService } from './race.service';
import { RaceModel } from './models/race.model';
import { AppModule } from './app.module';
import { RacesModule } from './races/races.module';
import { RACES_ROUTES } from './races/races.routes';
import { AppComponent } from './app.component';

describe('RaceResolverService', () => {
  let appComponentFixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, RacesModule]
    });

    // override the lazy loaded module
    const router: Router = TestBed.get(Router);
    router.resetConfig([{ path: 'races', children: RACES_ROUTES }]);

    appComponentFixture = TestBed.createComponent(AppComponent);
    appComponentFixture.detectChanges();
  });

  it('should resolve race using the raceId route parameter', () => {
    const raceService: RaceService = TestBed.get(RaceService);
    const expectedResult: Observable<RaceModel> = EMPTY;

    spyOn(raceService, 'get').and.returnValue(expectedResult);

    const resolver: RaceResolverService = TestBed.get(RaceResolverService);

    const params = { raceId: '42' } as Params;
    const paramMap = convertToParamMap(params);

    const routeSnapshot = { params, paramMap } as ActivatedRouteSnapshot;
    const result = resolver.resolve(routeSnapshot, undefined);

    expect(result)
      .withContext('The resolver should call return a race')
      .toBe(expectedResult);
    expect(+(raceService.get as jasmine.Spy).calls.argsFor(0)[0])
      .withContext('The resolver should call the RaceService.get method with the id')
      .toBe(42);
  });

  it('should be applied on the bet route', fakeAsync(() => {
    const resolver: RaceResolverService = TestBed.get(RaceResolverService);
    spyOn(resolver, 'resolve').and.returnValue(of({ id: 42 } as RaceModel));

    const router: Router = TestBed.get(Router);
    router.navigateByUrl('/races/42');

    tick();
    appComponentFixture.detectChanges();
    expect(resolver.resolve).toHaveBeenCalled();
  }));

  it('should be applied on the live route', fakeAsync(() => {
    const resolver: RaceResolverService = TestBed.get(RaceResolverService);
    spyOn(resolver, 'resolve').and.returnValue(of({ id: 42 } as RaceModel));
    const raceService: RaceService = TestBed.get(RaceService);
    spyOn(raceService, 'live').and.returnValue(of([]));

    const router: Router = TestBed.get(Router);
    router.navigateByUrl('/races/42/live');

    tick();
    appComponentFixture.detectChanges();
    expect(resolver.resolve).toHaveBeenCalled();
  }));
});
