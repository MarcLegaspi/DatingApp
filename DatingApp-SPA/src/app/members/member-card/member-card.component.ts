import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() _user: User;
  _currentUser: User = JSON.parse(localStorage.getItem('user'));
  constructor(private _userService: UserService, private _alertify: AlertifyService) { }

  ngOnInit() {
  }

  sendLike() {
    console.log(this._currentUser);
    console.log(this._user);
    this._userService.sendLike(this._currentUser.id, this._user.id).subscribe(response => {
      this._alertify.success('You have liked: ' + this._user.username);
    }, error => {
        this._alertify.error(error);
    });
  }
}
