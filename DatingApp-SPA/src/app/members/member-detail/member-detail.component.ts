import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  private _user:User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private _userService: UserService, private _alertify: AlertifyService, private _route: ActivatedRoute) { }

  ngOnInit() {
  this._route.data.subscribe(data =>{
      this._user = data['user'];
    });
    

    this.galleryOptions = [
      {
          width: '500px',
          height: '500px',
          imagePercent:100,
          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide,
          preview:false
      }
    ];

    this.galleryImages= this.getImages();
    //this.loadUser();
  }

  getImages(){
    const imageUrls = [];
    for (const photo of this._user.photos){
      imageUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description
      })
    }

    return imageUrls;
  }

  // loadUser(){
  //   this._userService.getUser(+this._route.snapshot.params['id']).subscribe((user: User) =>{
  //     this._user = user;
  //   },error => {
  //     this._alertify.error(error);
  //   })
  // }

}
