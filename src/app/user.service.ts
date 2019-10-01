import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserModel } from './models/user.model';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { JwtInterceptorService } from './jwt-interceptor.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userEvents = new BehaviorSubject<UserModel>(undefined);

  constructor(private http: HttpClient, private jwtInterceptor: JwtInterceptorService) {
    this.retrieveUser();
  }

  register(login: string, password: string, birthYear: number): Observable<any> {
    return this.http.post(environment.baseUrl + '/api/users', {
      login,
      password,
      birthYear
    });
  }

  authenticate(creditials: {login: string, password: string}): Observable<any>  {
    return this.http.post(environment.baseUrl + '/api/users/authentication', {
      login: creditials.login,
      password: creditials.password
    })
    .pipe(tap(user => {
      this.storeLoggedInUser(user as {
        id: number,
        login: string,
        money: number,
        registrationInstant: string,
        token: string
      });
    }));
  }

  storeLoggedInUser(user: UserModel) {
    window.localStorage.setItem('rememberMe', JSON.stringify(user));
    this.userEvents.next(user);
    this.jwtInterceptor.setJwtToken(user.token);
  }

  retrieveUser() {
    const storageUser = window.localStorage.getItem('rememberMe');
    if (storageUser) {
      const user: UserModel = JSON.parse(storageUser);
      this.userEvents.next(user);
      this.jwtInterceptor.setJwtToken(user.token);
    }
  }

  logout() {
    this.userEvents.next(null);
    window.localStorage.removeItem('rememberMe');
    this.jwtInterceptor.removeJwtToken();
  }
}
