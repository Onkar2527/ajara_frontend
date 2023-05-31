import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
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
      // sessionStorage.setItem("lk0oh6fdb4567","jdfjkhguyrtb");
      // 
      
      this.api.login(this.USER_NAME, this.PASSWORD).subscribe({
        next: (data) => {
          if (data['code'] == 200 && data['data']) {
            this.isLogedIn = true;
            console.log("login data",this.api.decryptData(data));
            let res:any = this.api.decryptData(data);
            sessionStorage.setItem("lk0oh6fdb4567",res[0]['USER_KEY'])
            this.logined.emit(true)
            this.isloginSpinning = false
            
          }
          else if (data == 404) {
            
            this.isloginSpinning = false

          }

        }

      })
    }


  }

}
