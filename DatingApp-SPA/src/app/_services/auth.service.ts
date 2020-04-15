import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _jwtHelper = new JwtHelperService();
  private _baseUrl = environment.apiUrl + 'auth/';
  DecodedToken: any;
  CurrentUser: User;
  private _photoUrl = new BehaviorSubject<string>('../assets/no photo.jpg');

  currentPhotoUrl = this._photoUrl.asObservable();

  constructor(private _http: HttpClient) { }

  changeMemberPhoto(photoUrl: string) {
    this._photoUrl.next(photoUrl);
  }

  login(model: any) {
    return this._http.post(this._baseUrl + 'login', model)
      .pipe(
        map((res: any) => {
          const user = res;
          if (user) {
            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user.user));
            this.DecodedToken = this._jwtHelper.decodeToken(user.token);
            this.CurrentUser = user.user;

            this.changeMemberPhoto(this.CurrentUser.photoUrl);
          }
        })
      );
  }

  register(model: any): any {
    return this._http.post(this._baseUrl + 'register', model);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this._jwtHelper.isTokenExpired(token);
  }
}
