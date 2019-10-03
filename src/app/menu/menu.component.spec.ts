import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, RouterLinkWithHref } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { MenuComponent } from './menu.component';
import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';

describe('MenuComponent', () => {
  const fakeUserService = {
    userEvents: new Subject<UserModel>(),
    logout: () => {},
    scoreUpdates: (userId: number) => {}
  } as UserService;
  const fakeRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MenuComponent],
      providers: [{ provide: UserService, useValue: fakeUserService }]
    })
  );

  it('should have a `navbarCollapsed` field', () => {
    const menu: MenuComponent = new MenuComponent(fakeUserService, fakeRouter);
    menu.ngOnInit();
    expect(menu.navbarCollapsed)
      .withContext(
        'Check that `navbarCollapsed` is initialized with `true`.' + 'Maybe you forgot to declare `navbarCollapsed` in your component.'
      )
      .toBe(true);
  });

  it('should have a `toggleNavbar` method', () => {
    const menu: MenuComponent = new MenuComponent(fakeUserService, fakeRouter);
    expect(menu.toggleNavbar)
      .withContext('Maybe you forgot to declare a `toggleNavbar()` method')
      .not.toBeNull();

    menu.toggleNavbar();

    expect(menu.navbarCollapsed)
      .withContext('`toggleNavbar()` should change `navbarCollapsed` from `true` to `false`')
      .toBe(false);

    menu.toggleNavbar();

    expect(menu.navbarCollapsed)
      .withContext('`toggleNavbar()` should change `navbarCollapsed` from false to true`')
      .toBe(true);
  });

  it('should toggle the class on click', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    const element = fixture.nativeElement;

    fixture.detectChanges();

    const navbarCollapsed = element.querySelector('#navbar');
    expect(navbarCollapsed)
      .withContext('No element with the id `#navbar`')
      .not.toBeNull();
    expect(navbarCollapsed.classList)
      .withContext('The element with the id `#navbar` should have the class `collapse`')
      .toContain('collapse');

    const button = element.querySelector('button');
    expect(button)
      .withContext('No `button` element to collapse the menu')
      .not.toBeNull();
    button.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    const navbar = element.querySelector('#navbar');
    expect(navbar.classList)
      .withContext('The element with the id `#navbar` should have not the class `collapse` after a click')
      .not.toContain('collapse');
  });

  it('should use routerLink to navigate', () => {
    const fakeScoreUpdates = new Subject<UserModel>();
    spyOn(fakeUserService, 'scoreUpdates').and.returnValue(fakeScoreUpdates);

    const fixture = TestBed.createComponent(MenuComponent);

    fixture.detectChanges();

    const links = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
    expect(links.length)
      .withContext('You should have only one routerLink to the home when the user is not logged')
      .toBe(1);
    fakeUserService.userEvents.next({ login: 'cedric', money: 200 } as UserModel);
    fixture.detectChanges();

    const linksAfterLogin = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
    expect(linksAfterLogin.length)
      .withContext('You should have three routerLink: one to the races, one to the home, one to the money history when the user is logged')
      .toBe(3);
  });

  it('should listen to userEvents and score updates in ngOnInit', fakeAsync(() => {
    const component = new MenuComponent(fakeUserService, fakeRouter);
    component.ngOnInit();

    // emulate a login
    const fakeScoreUpdates = new Subject<UserModel>();
    spyOn(fakeUserService, 'scoreUpdates').and.returnValue(fakeScoreUpdates);
    const user = { id: 1, login: 'cedric', money: 200 } as UserModel;
    let userEvent: UserModel = null;
    component.userEvents.subscribe(event => (userEvent = event));
    fakeUserService.userEvents.next(user);
    tick();
    expect(userEvent)
      .withContext('Your component should listen to the `userEvents` observable on login')
      .toBe(user);

    expect(fakeUserService.scoreUpdates).toHaveBeenCalledWith(user.id);
    tick();

    // emulate a score update
    user.money = 300;
    fakeScoreUpdates.next(user);
    tick();

    expect(userEvent.money)
      .withContext('Your component should listen to the `scoreUpdates` observable')
      .toBe(300);

    // emulate an error
    fakeScoreUpdates.error('You should catch potential errors on score updates with a `.catch()`');
    tick();
    expect(userEvent.money)
      .withContext('Your component should catch error on score updates')
      .toBe(300);

    // emulate a score update
    user.money = 400;
    fakeScoreUpdates.next(user);
    tick();

    expect(userEvent.money)
      .withContext('Your component should catch error on score updates')
      .toBe(400);

    // emulate a logout
    fakeUserService.userEvents.next(null);
    tick();

    expect(userEvent)
      .withContext('Your component should listen to the `userEvents` observable on logout')
      .toBe(null);
  }));

  it('should display the user if logged', () => {
    const fakeScoreUpdates = new Subject<UserModel>();
    spyOn(fakeUserService, 'scoreUpdates').and.returnValue(fakeScoreUpdates);

    const fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();
    fakeUserService.userEvents.next({ login: 'cedric', money: 200 } as UserModel);

    fixture.detectChanges();

    const element = fixture.nativeElement;
    const info = element.querySelector('a.nav-item.nav-link.mr-2');
    expect(info)
      .withContext('You should have an `a` element with the classes `nav-item nav-link mr-2` to display the user info')
      .not.toBeNull();
    expect(info.textContent)
      .withContext('You should display the name of the user in an `a` element')
      .toContain('cedric');
    expect(info.textContent)
      .withContext('You should display the score of the user in an `a` element')
      .toContain('200');
  });

  it('should display a logout button', () => {
    const fakeScoreUpdates = new Subject<UserModel>();
    spyOn(fakeUserService, 'scoreUpdates').and.returnValue(fakeScoreUpdates);

    const fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();
    fakeUserService.userEvents.next({ login: 'cedric', money: 200 } as UserModel);
    fixture.detectChanges();
    spyOn(fixture.componentInstance, 'logout');

    const element = fixture.nativeElement;
    const logout = element.querySelector('span.fa-power-off');
    expect(logout)
      .withContext('You should have a span element with a class `fa-power-off` to log out')
      .not.toBeNull();
    logout.dispatchEvent(new Event('click', { bubbles: true }));

    fixture.detectChanges();
    expect(fixture.componentInstance.logout).toHaveBeenCalled();
  });

  it('should stop the click event propagation', () => {
    const component = new MenuComponent(fakeUserService, fakeRouter);
    const event = new Event('click');
    spyOn(fakeUserService, 'logout');
    spyOn(event, 'preventDefault');
    component.logout(event);

    expect(fakeUserService.logout).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(fakeRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
