import { Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

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

  constructor(public router: Router, private api: ApiService,private message: NzNotificationService) { }

  sideMenu = []

  ngOnInit(): void {

    if (sessionStorage.getItem("lk0oh6fdb4567") == null) {
      this.router.navigate(['login']);
      this.route = 'login';
    }
    else {
      this.router.navigate(['/proposal']);
      this.getSideMenu(); 
      this.route = 'tabs';
    }
  }

  ngOnChanges() {

  }
  login() {
    this.router.navigate(['/proposal']);
    this.getSideMenu(); 
    this.route = 'tabs';
  }

  getSideMenu() {
    let user_key = sessionStorage.getItem('lk0oh6fdb4567');

    this.api.getSideMenu(user_key).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data']) {
          let data = this.api.decryptData(res);
          this.sideMenu = data;
        }
        else{
          this.message.error("Internal server Error!",'')
        }
      },
      error:()=>{
        this.message.error("Internal server Error!",'')
      }
    })
  }

 
}
