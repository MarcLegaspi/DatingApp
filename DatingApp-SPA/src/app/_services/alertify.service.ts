import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() { }

  confirm(message: string, okCallback: () => any) {
    alertify.confirm(message, (e: any) => {
      if (e) {
        okCallback();
      }
      else { }
    });
  }

  success(message:string){
    var delay = alertify.get('notifier', 'delay');
    alertify.set('notifier', 'delay', 5);
    alertify.success(message);
    alertify.set('notifier','delay', delay);
  }
  
  error(message:string){
    var delay = alertify.get('notifier', 'delay');
    alertify.set('notifier', 'delay', 5);
    alertify.error(message);
    alertify.set('notifier','delay', delay);
  }
  warning(message:string){
    var delay = alertify.get('notifier', 'delay');
    alertify.set('notifier', 'delay', 5);
    alertify.warning(message);
    alertify.set('notifier','delay', delay);
  }
  message(message:string){
    var delay = alertify.get('notifier', 'delay');
    alertify.set('notifier', 'delay', 5);
    alertify.message(message);
    alertify.set('notifier','delay', delay);
  }
}
