import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() _photos: Photo[];
  @Output() _getMemberPhotoChange= new EventEmitter<string>();
  private _baseUrl = environment.apiUrl;
  private _currentMain: Photo;

  constructor(private _userService: UserService, private _authService: AuthService, private _alertify: AlertifyService) { }

  uploader: FileUploader;
  hasBaseDropZoneOver = false;

  ngOnInit() {
    this.initializeUploader();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this._baseUrl + 'users/' + this._authService.DecodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: false,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (item => {
      item.withCredentials = false;
    });

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          isMain: res.isMain,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description
        };

        if(res.isMain) {
          this._authService.changeMemberPhoto(photo.url);
          this._authService.CurrentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this._authService.CurrentUser));
        }

        this._photos.push(photo);
        this.uploader.clearQueue();
      }
    };
  }

  setMainPhoto(photo: Photo) {
    console.log(photo);
    this._userService.setMain(this._authService.DecodedToken.nameid, photo.id).subscribe(res =>{
      this._alertify.success('Photos successfully set to main');
      this._currentMain = this._photos.filter(p => p.isMain === true)[0];
      this._currentMain.isMain = false;
      photo.isMain = true;

      this._authService.changeMemberPhoto(photo.url);
      this._authService.CurrentUser.photoUrl = photo.url;
      localStorage.setItem('user', JSON.stringify(this._authService.CurrentUser));
    }, error => {
      this._alertify.error(error);
    });
  }

  deletePhoto(id: number) {
    this._alertify.confirm('Are you sure you want to delete this photo', () => {
      this._userService.deletePhoto(this._authService.DecodedToken.nameid, id).subscribe(data => {
      this._photos.splice(this._photos.findIndex(p => p.id === id), 1);
      this._alertify.success('Photo has been deleted');
      }, error => {
        this._alertify.error('Failed to delete the photo');
      });
    });
  }
}
