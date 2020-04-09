import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private _jwtHelper = new JwtHelperService()
DecodedToken: any;

  constructor(private _http: HttpClient) { }

  private _baseUrl: string = "http://localhost:5000/api/auth/";

  login(model: any) {
    return this._http.post(this._baseUrl + 'login', model)
      .pipe(
        map((res: any) => {
          const user = res;
          console.log('res');
          console.log(user.token);
          console.log('res');
          if (user) {
            localStorage.setItem('token', user.token);
            this.DecodedToken = this._jwtHelper.decodeToken(user.token);
          }
        })
      );
  }

  register(model:any):any{
    return this._http.post(this._baseUrl + 'register', model);
  }

  loggedIn(){
    var token = localStorage.getItem('token');
    return !this._jwtHelper.isTokenExpired(token);
  }
}
