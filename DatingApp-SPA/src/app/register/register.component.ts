import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private _user: User;
  @Output() _cancelResponse = new EventEmitter();
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private _authService: AuthService, private _alertify: AlertifyService, private _fb: FormBuilder, private _router:Router) { }

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-red'
    };
    // this.registerForm = new FormGroup({
    //   username: new FormControl('', [Validators.required]),
    //   password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('', [Validators.required])
    // }, this.passwordMatchValidator);
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this._fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    // tslint:disable-next-line: object-literal-key-quotes
    return g.get('password').value === g.get('confirmPassword').value ? null : { 'mismatch': true };
  }

  register() {
    // this._authService.register(this._model).subscribe(res => {
    //   this._alertify.success('Registered successfully');
    // }, error =>{
    //   console.log(error);
    //   this._alertify.error(error);
    // });
    // console.log(this._model);
    if (this.registerForm.valid) {
      this._user = Object.assign({}, this.registerForm.value);
      this._authService.register(this._user).subscribe(res => {
        this._alertify.success('Registration successful');
      }, error => {
        console.log(error);
        this._alertify.error(error);
      }, () => {
        this._authService.login(this._user).subscribe(() => {
          this._router.navigate(['/members']);
        });
      });
    }
  }

  cancel() {
    console.log('cancel');
    this._cancelResponse.emit(false);
  }

}
