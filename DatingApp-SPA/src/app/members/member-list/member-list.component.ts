import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  _users: User[];

  constructor(private _userService: UserService, private _alertify: AlertifyService, private _route:ActivatedRoute) { }

  ngOnInit() {
    this._route.data.subscribe(data =>{
      this._users = data['users'];
    })

    this.loadUsers();
  }

  loadUsers(){
    this._userService.getUsers().subscribe((res: User[]) => {
        this._users = res;
        console.log(res);
    }, error =>{
      this._alertify.error(error);
    });
  }
}
