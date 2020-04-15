import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './_services/auth.service';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
private _jwtHelper = new JwtHelperService();
  constructor(private _authService: AuthService) {

  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (token) {
      this._authService.DecodedToken = this._jwtHelper.decodeToken(token);
    }

    if (user) {
        this._authService.CurrentUser = user;
        this._authService.changeMemberPhoto(user.photoUrl);
    }
  }
}
