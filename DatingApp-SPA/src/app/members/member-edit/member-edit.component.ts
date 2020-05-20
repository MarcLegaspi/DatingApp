import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm', { static: true }) _editForm: NgForm;
  _user: User;
  _photoUrl: string;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this._editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(private _route: ActivatedRoute, private _userService: UserService,
              private _authService: AuthService, private _alertify: AlertifyService) { }

  ngOnInit() {
    this._route.data.subscribe(data => {
      this._user = data['user'];
    });

    this._authService.currentPhotoUrl.subscribe(data => {
      this._photoUrl = data;
    });
  }

  updateUser()
  {
    this._userService.updateUser(this._authService.DecodedToken.nameid, this._user).subscribe(next =>{
    this._alertify.success('User updated successfully');
    this._editForm.reset(this._user);
    }, error => {
      this._alertify.error(error);
    });
  }
}
