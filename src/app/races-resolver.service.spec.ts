import { fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';

import { RacesResolverService } from './races-resolver.service';
import { RaceService } from './race.service';
import { RaceModel } from './models/race.model';
import { AppModule } from './app.module';
import { LoggedInGuard } from './logged-in.guard';
import { AppComponent } from './app.component';

describe('RacesResolverService', () => {
  let appComponentFixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });

    const loggedInGuard: LoggedInGuard = TestBed.get(LoggedInGuard);
    spyOn(loggedInGuard, 'canActivate').and.returnValue(true);

    appComponentFixture = TestBed.createComponent(AppComponent);
    appComponentFixture.detectChanges();
  });

  it('should resolve races using the path of the activated route config ', () => {
    const raceService: RaceService = TestBed.get(RaceService);
    const expectedResult: Observable<Array<RaceModel>> = EMPTY;

    spyOn(raceService, 'list').and.returnValue(expectedResult);

    const resolver: RacesResolverService = TestBed.get(RacesResolverService);
    const routeSnapshot = {
      routeConfig: { path: 'finished' }
    } as ActivatedRouteSnapshot;
    const result = resolver.resolve(routeSnapshot, undefined);

    expect(result)
      .withContext('The resolver should return the races')
      .toBe(expectedResult);
    expect(raceService.list).toHaveBeenCalledWith('FINISHED');
  });

  it('should be applied on the pending races route', fakeAsync(() => {
    const resolver: RacesResolverService = TestBed.get(RacesResolverService);
    spyOn(resolver, 'resolve').and.returnValue(of([]));

    const router: Router = TestBed.get(Router);
    router.navigateByUrl('/races/pending');

    tick();
    appComponentFixture.detectChanges();
    expect(resolver.resolve).toHaveBeenCalled();
  }));

  it('should be applied on the finished races route', fakeAsync(() => {
    const resolver: RacesResolverService = TestBed.get(RacesResolverService);
    spyOn(resolver, 'resolve').and.returnValue(of([]));

    const router: Router = TestBed.get(Router);
    router.navigateByUrl('/races/finished');

    tick();
    appComponentFixture.detectChanges();
    expect(resolver.resolve).toHaveBeenCalled();
  }));
});
