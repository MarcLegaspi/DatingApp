import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private _baseUrl = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  getUsers(page?, itemsPerPage?, userParams?: any, likesParam?: any): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likesParam === 'Likers') {
      params = params.append('likers', 'true');
    }

    if (likesParam === 'Likees') {
      params = params.append('likees', 'true');
    }

    return this._http.get<User[]>(this._baseUrl + 'users', { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
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

  sendLike(userId: number, recipientId: number){
    return this._http.post(this._baseUrl + 'users/' + userId + '/like/' + recipientId, {});
  }
}
