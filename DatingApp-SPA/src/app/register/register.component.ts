import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private _model: any = {};
  @Output() _cancelResponse = new EventEmitter();

  constructor(private _authService:AuthService,private _alertify:AlertifyService) { }

  ngOnInit() {
  }

  register() {
    this._authService.register(this._model).subscribe(res => {
      this._alertify.success('Registered successfully');
    },error =>{
      console.log(error);
      this._alertify.error(error);
    });
    console.log(this._model);

  }

  cancel() {
    console.log('cancel');
    this._cancelResponse.emit(false);
  }

}
