import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '_services/auth.service';
import { AlertifyService } from '_services/alertify.service';

 @Injectable({
    providedIn:'root'
  })
export class AuthGuard implements CanActivate {
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;

 
  canActivate(): boolean {
    if(this._authService.loggedIn())
    {
      return true;
    } 
    
    this._alertify.error('You shall not pass');
    this._router.navigate(['/home']);
    return false;
  }

  constructor(private _authService:AuthService, 
    private _router:Router, 
    private _alertify:AlertifyService){}
}


