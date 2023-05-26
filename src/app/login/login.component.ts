import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

@Component({

  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ]
})
export class LoginComponent implements OnInit {
  @Output() logined = new EventEmitter<boolean>();
  validateForm!: UntypedFormGroup;
  USER_NAME = '';
  PASSWORD = '';
  message: any;
  isloginSpinning: boolean = false;
  isLogedIn: boolean = false;


  constructor(private fb: UntypedFormBuilder, private api: ApiService, private router: Router) { }

  ngOnInit(): void {



    this.validateForm = this.fb.group({
      USER_NAME: [null, [Validators.required]],
      PASSWORD: [null, [Validators.required]],
      remember: [true]
    });



    if (this.isLogedIn = true) {
      console.log(this.isLogedIn + "Hey there ")
      this.isLogedIn = false;
    }





  }



  login(): void {
    {
      sessionStorage.setItem("lk0oh6fdb4567","jdfjkhguyrtb");
      
      this.api.login(this.USER_NAME, this.PASSWORD).subscribe({
        next: (data) => {
          if (data['code'] == 200) {
            this.isLogedIn = true;

            this.isloginSpinning = false
            window.alert("Login Successfully ")


            this.message('L', "Login Successfully ")
          }
          else if (data == 404) {
            this.message.error("Login Failed with username= ")
            this.isloginSpinning = false

          }

        }




      })
    }





  }

}
