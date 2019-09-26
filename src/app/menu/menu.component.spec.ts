import { TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [MenuComponent]
    })
  );

  it('should have a `navbarCollapsed` field', () => {
    const menu: MenuComponent = new MenuComponent();
    menu.ngOnInit();
    expect(menu.navbarCollapsed)
      .withContext(
        'Check that `navbarCollapsed` is initialized with `true`.' + 'Maybe you forgot to declare `navbarCollapsed` in your component.'
      )
      .toBe(true);
  });

  it('should have a `toggleNavbar` method', () => {
    const menu: MenuComponent = new MenuComponent();
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
});
