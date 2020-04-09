import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BsDropdownModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { ValueComponent } from './value/value.component';
import { AuthService } from '_services/auth.service';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { FormsModule } from '@angular/forms';
import { ErrorInterceptorProvider } from '_services/error.interceptor';

@NgModule({
   declarations: [
      AppComponent,
      ValueComponent,
      RegisterComponent,
      HomeComponent,
      NavComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      BsDropdownModule.forRoot()
   ],
   providers: [
      AuthService,
      ErrorInterceptorProvider
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
