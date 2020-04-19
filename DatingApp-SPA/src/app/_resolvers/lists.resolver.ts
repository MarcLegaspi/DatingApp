import { Injectable } from "@angular/core";
import { User } from '../_models/user';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ListsResolver implements Resolve<User[]> {
    pageNumber = 1;
    pageSize = 12;
    _likesParams = 'Likers';

    constructor(private _userService: UserService, private _router: Router, private _alertify: AlertifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this._userService.getUsers(this.pageNumber, this.pageSize, null, this._likesParams).pipe(
            catchError(error => {
                this._alertify.error('Problem retrieving data');
                this._router.navigate(['/home']);
                return of(null);
            })
        )
    }
}