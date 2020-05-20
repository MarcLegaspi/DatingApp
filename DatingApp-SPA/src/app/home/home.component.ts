import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isRegisterMode = false;
  constructor() { }

  ngOnInit() {
  }

  registerToggle(){
    this.isRegisterMode = true;
  }
  
  cancel(result:boolean)
  {
    this.isRegisterMode = result;
  }
}
