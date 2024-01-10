import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { SessionUserDetails } from '../common_modules/session_storage/SessionUserDetails';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {

  @Output() logined = new EventEmitter<boolean>();
  USER_NAME = '';
  PASSWORD = '';
  isMobileView = false;

  isloginSpinning: boolean = false;
  isLogedIn: boolean = false;

  constructor(private api: ApiService, private router: Router, private message: NzNotificationService) { }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }
  ngOnInit(): void {

    if (this.isLogedIn = true) {
      console.log(this.isLogedIn + "Hey there ")
      this.isLogedIn = false;
    }
    this.checkScreenSize();


  }

  checkScreenSize(): void {
    this.isMobileView = window.innerWidth <= 768;
  }

  login(): void {
    sessionStorage.clear();
    this.isloginSpinning = true;
    this.api.login(this.USER_NAME, this.PASSWORD).subscribe({
      next: (data) => {
        if (data['code'] == 200 && data['data']) {

          SessionUserDetails.setSessionStorage(data['data']);
          this.logined.emit(true);
          this.isloginSpinning = false

        }
        else if (data['code'] == 404) {
          this.message.error("Username or Password not found!", '');
          this.isloginSpinning = false

        }
        else {
          this.message.error("Something went wrong!", '');
          this.isloginSpinning = false
        }

      },
      error: () => {
        this.isloginSpinning = false

      }

    })

  }

}
