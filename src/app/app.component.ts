import { Component, OnChanges, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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

  collapseMenu() {
    this.isCollapsed ? this.isCollapsed = false : this.isCollapsed = true;
  }

  constructor(public router: Router, private api: ApiService, private message: NzNotificationService) {
    // this.router.events.subscribe((event)=>{
    //   if(event instanceof NavigationEnd){
    //     router.navigateByUrl('/');
    //   }
    // })
  }

  sideMenu = []
  userDetails = {
    BRANCH_ID: 1,
    ID: 1,
    NAME: "",
    PASSWORD: "",
    ROLE_ID: 1,
    USER_NAME: ""
  }
  ngOnInit(): void {

    if (sessionStorage.getItem("lk0oh6fdb4567") == null) {
      this.router.navigate(['login']);
      this.route = 'login';
    }
    else {
      this.login();
    }
  }

  ngOnChanges() {

  }
  login() {
    this.router.navigate(['/proposal']);
    this.getSideMenu();
    this.getUser();
    this.route = 'tabs';
  }
  user: string = '';


  getUser() {
    let user_key = sessionStorage.getItem('lk0oh6fdb4567');

    if (user_key) {
      this.api.getUser(user_key).subscribe({
        next: (res) => {
          if (res['code'] && res['data']) {
            console.log("res['data']", res['data']);
            let data = this.api.decryptData(res);
            this.userDetails = data;
            if (this.userDetails.ROLE_ID == 1) {
              this.user = 'BA';

            }
            else if (this.userDetails.ROLE_ID == 2) {
              this.user = 'BM';
            }
            else if (this.userDetails.ROLE_ID == 3) {
              this.user = 'HO';
            }
          }
        },
        error: () => {

        }
      })
    }
  }

  logout() {
    sessionStorage.clear();
    window.location.reload();
  }

  getSideMenu() {
    let user_key = sessionStorage.getItem('lk0oh6fdb4567');

    this.api.getSideMenu(user_key).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data']) {
          let data = this.api.decryptData(res);
          this.sideMenu = data;
        }
        else {
          this.message.error("Internal server Error!", '')
        }
      },
      error: () => {
        this.message.error("Internal server Error!", '')
      }
    })
  }


}
