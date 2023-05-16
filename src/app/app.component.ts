import { Component,OnChanges,OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges {
  title = 'FACO';
  //find a better alternative for 
  isLoggedIn = false           //
  //this
  isCollapsed = false;

  route = ''

  constructor(public router: Router){}

  ngOnInit(): void {
    if(!this.isLoggedIn){
      this.router.navigate(['login']);
      this.route = 'login';
    }
  }
  ngOnChanges(){
    if(!this.isLoggedIn){
      this.router.navigate(['login']);
      this.route = 'login';
    }
  }
}
