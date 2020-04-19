import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  _users: User[];
  _user: User = JSON.parse(localStorage.getItem('user'));
  _genderList: any = [{value: 'male', display: 'Males' }, {value: 'female', display: 'Females' }];
  _userParams: any = {};
  pagination: Pagination;

  constructor(private _userService: UserService, private _alertify: AlertifyService, private _route: ActivatedRoute) { }

  ngOnInit() {
    this._route.data.subscribe(data => {
      this._users = data['users'].result;
      this.pagination = data['users'].pagination;
    });

    this._userParams.gender = this._user.gender === 'male' ? 'female' : 'male';
    this._userParams.minAge = 18;
    this._userParams.maxAge = 99;
    this._userParams.orderBy = 'lastActive';
  }

  resetFilters() {
    this._userParams.gender = this._user.gender === 'male' ? 'female' : 'male';
    this._userParams.minAge = 18;
    this._userParams.maxAge = 99;
    this._userParams.orderBy = 'lastActive';
    this.loadUsers();
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers() {
    console.log(this._userParams);
    this._userService
      .getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this._userParams)
      .subscribe((res: PaginatedResult<User[]>) => {
        this._users = res.result;
        this.pagination = res.pagination;
        console.log(res);
    }, error => {
      this._alertify.error(error);
    });
  }
}
