import { Injectable } from "@angular/core";
import { User } from '../_models/user';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MemberEditResolver implements Resolve<User>{
    constructor(private _userService:UserService, private _authService:AuthService, 
                private _router: Router, private _alertify: AlertifyService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this._userService.getUser(this._authService.DecodedToken.nameid).pipe(
            catchError(error => {
                this._alertify.error('Problem retrieving your data');
                this._router.navigate['/members'];
                return of(null);
            })
        )
    }
}