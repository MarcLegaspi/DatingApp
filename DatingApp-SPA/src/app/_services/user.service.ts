import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private _baseUrl = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  getUsers(): Observable<User[]> {
    console.log(this._baseUrl);
    return this._http.get<User[]>(this._baseUrl + 'users');
  }

  getUser(id: number): Observable<User> {
    return this._http.get<User>(this._baseUrl + 'users/' + id);
  }

  updateUser(id: number, user: User) {
    return this._http.put(this._baseUrl + 'users/' + id, user);
  }

  setMain(userId: number, id: number) {
    return this._http.post(this._baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
  }

  deletePhoto(userId: number, id: number) {
    return this._http.delete(this._baseUrl + 'users/' + userId + '/photos/' + id);
  }
}
