import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  _users: User[];
  _likesParams: string;
  pagination: Pagination;


  constructor(private _authService: AuthService, private _userService: UserService, 
              private _alertify: AlertifyService, private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.data.subscribe(data => {
      console.log(data['users']);
      this._users = data['users'].result;
      this.pagination = data['users'].pagination;
    });

    this._likesParams = 'Likers';
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers() {
    console.log(this._likesParams);
    this._userService
      .getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this._likesParams)
      .subscribe((res: PaginatedResult<User[]>) => {
        this._users = res.result;
        this.pagination = res.pagination;
        console.log(res);
    }, error => {
      this._alertify.error(error);
    });
  }
}
