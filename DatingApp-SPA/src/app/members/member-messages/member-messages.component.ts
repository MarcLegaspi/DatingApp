import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(private userService: UserService, private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadMessage();
  }

  loadMessage() {
    this.userService.getMessageThread(this.authService.DecodedToken.nameid, this.recipientId)
      .pipe(
        tap(messages => {
          for (const message of messages) {
            const userId = +this.authService.DecodedToken.nameid;
            if (message.isRead === false && message.recipientId === userId) {
              this.userService.markAsRead(message.id, userId);
            }
          }
          // for (let i = 0; i < this.messages.length; i++) {
          //   const userId = this.authService.DecodedToken.nameid
          //   if (this.messages[i].isRead === false && this.messages[i].recipientId === userId) {
          //     this.userService.markAsRead(this.messages[i].id, userId);
          //   }
          // }
        })
      )
      .subscribe(res => {
        this.messages = res;
      }, error => {
        this.alertify.error(error);
      });
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    console.log(this.newMessage);
    this.userService.sendMessage(this.authService.DecodedToken.nameid, this.newMessage).subscribe((res: Message) => {
      //debugger;
      this.messages.unshift(res);
      this.newMessage.content = '';
    }, error => {
      this.alertify.error(error);
    });
  }
}
