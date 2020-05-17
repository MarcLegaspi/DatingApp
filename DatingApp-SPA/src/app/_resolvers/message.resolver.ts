import { Injectable } from "@angular/core";
import { User } from '../_models/user';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/message';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MessageResolver implements Resolve<Message[]> {
    pageNumber = 1;
    pageSize = 5;
    messageContainer = 'Unread';

    constructor(private _userService: UserService, private _router: Router, 
                private _alertify: AlertifyService, private authService: AuthService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
        const id = this.authService.DecodedToken.nameid;

        return this._userService.getMessages(id, this.pageNumber, this.pageSize, this.messageContainer).pipe(
            catchError(error => {
                this._alertify.error('Problem retrieving messages');
                this._router.navigate(['/home']);
                return of(null);
            })
        );
    }
}