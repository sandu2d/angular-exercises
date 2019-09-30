import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserModel } from './models/user.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiURL = 'http://ponyracer.ninja-squad.com';
  userEvents = new BehaviorSubject<UserModel>(undefined);

  constructor(private http: HttpClient) {
    this.retrieveUser();
  }

  register(login: string, password: string, birthYear: number): Observable<any> {
    return this.http.post(this.apiURL + '/api/users', {
      login,
      password,
      birthYear
    });
  }

  authenticate(creditials: {login: string, password: string}): Observable<any>  {
    return this.http.post(this.apiURL + '/api/users/authentication', {
      login: creditials.login,
      password: creditials.password
    })
    .pipe(tap(user => {
      this.storeLoggedInUser(user as {
        id: number,
        login: string,
        money: number,
        registrationInstant: string
      });
    }));
  }

  storeLoggedInUser(user: UserModel) {
    window.localStorage.setItem('rememberMe', JSON.stringify(user));
    this.userEvents.next(user);
  }

  retrieveUser() {
    const storageUser = window.localStorage.getItem('rememberMe');
    if (storageUser) {
      const user: UserModel = JSON.parse(storageUser);
      this.userEvents.next(user);
    }
  }

  logout() {
    this.userEvents.next(null);
    window.localStorage.removeItem('rememberMe');
  }
}
