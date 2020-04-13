import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  private _model:any={}

  constructor(private _authService:AuthService, private _alertify:AlertifyService, private _router:Router) { }

  ngOnInit() {
  }

  onSubmit(){
    console.log(this._model);
     this._authService.login(this._model).subscribe(res => 
      {
        this._alertify.success('Logged in successfully');
      },error =>{
        this._alertify.error(error);
        this._router.navigate(['/home']);
      }, () => {
        this._router.navigate(['/members']);
      })
  }

  loggedIn(){
    return this._authService.loggedIn();
  }

  logout(){
    localStorage.removeItem('token');
    this._alertify.message('Logged out');
    this._router.navigate(['/home']);
  }
}
