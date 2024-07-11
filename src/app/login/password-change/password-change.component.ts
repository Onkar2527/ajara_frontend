import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NzStatus } from 'ng-zorro-antd/core/types';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {

  @Output() passwordResetEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  passwordReset: PasswordReset = new PasswordReset();

  passwordPatternStr = ''
  // /^(?=(.*[A-Z]){2,})(?=(.*[a-z]){2,})(?=(.*\d){2,})(?=(.*[\W_]){2,}).{2,}$/

  passwordPatternRegex!: RegExp;

  passwordPolicyData: any;

  validationString = ''

  newPasswordStatus: NzStatus = ''
  repeatPasswordStatus: NzStatus = ''

  oldPasswordVisible = false;
  newPasswordVisible = false;
  repeatPasswordVisible = false;

  isSpinning = false;

  passwordPolicyStrObj = {
    capital_letter:"",
    small_letter:"",
    number:"",
    symbol:"",
    passLength:""
  }

  constructor(private api: ApiService, private router: Router, private message: NzNotificationService) { }

  ngOnInit(): void {
    this.getPasswordPolicy();
  }

  getPasswordPolicy() {
    this.isSpinning = true;
    this.api.getPasswordPolicyData().subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.isSpinning = false;
          this.passwordPolicyData = res['data'];
          this.passwordPatternStr = `^(?=(.*[A-Z]){${this.passwordPolicyData.FR_CAPITAL_LETTERS},})(?=(.*[a-z]){${this.passwordPolicyData.FR_SMALL_LETTERS},})(?=(.*\\d){${this.passwordPolicyData.FR_NUMBERS},})(?=(.*[\\W_]){${this.passwordPolicyData.FR_SYMBOLS},}).{${this.passwordPolicyData.PASSWORD_LENGTH},}$`
          this.passwordPatternRegex = new RegExp(String.raw`${this.passwordPatternStr}`);
          console.log(this.passwordPatternStr, this.passwordPatternRegex);

          this.passwordPolicyStrObj.capital_letter = `${this.passwordPolicyData.FR_CAPITAL_LETTERS ? `${this.passwordPolicyData.FR_CAPITAL_LETTERS} capital (uppercase) letter${this.passwordPolicyData.FR_CAPITAL_LETTERS != 1 ? 's' : ''}` : ''}`
          this.passwordPolicyStrObj.small_letter = `${this.passwordPolicyData.FR_SMALL_LETTERS ? `${this.passwordPolicyData.FR_SMALL_LETTERS} lowercase letter${this.passwordPolicyData.FR_SMALL_LETTERS != 1 ? 's' : ''}` : ''}`
          this.passwordPolicyStrObj.number = `${this.passwordPolicyData.FR_NUMBERS ? `${this.passwordPolicyData.FR_NUMBERS} number${this.passwordPolicyData.FR_NUMBERS != 1 ? 's' : ''}` : ''}`
          this.passwordPolicyStrObj.symbol = `${this.passwordPolicyData.FR_SYMBOLS ? `${this.passwordPolicyData.FR_SYMBOLS} symbol${this.passwordPolicyData.FR_SYMBOLS != 1 ? 's' : ''}` : ''}`
          this.passwordPolicyStrObj.passLength =  `${this.passwordPolicyData.PASSWORD_LENGTH ? `Minimum ${this.passwordPolicyData.PASSWORD_LENGTH} character${this.passwordPolicyData.PASSWORD_LENGTH != 1 ? 's' : ''}` : ''}`

          this.validationString = `Password must contain the following : ${this.passwordPolicyStrObj.small_letter}
          ${this.passwordPolicyStrObj.capital_letter}
          ${this.passwordPolicyStrObj.number}
          ${this.passwordPolicyStrObj.symbol}
          ${this.passwordPolicyStrObj.passLength}`.split("\n")
          .map(s => s.trim())
          .filter(Boolean)
          .join(", ");

          console.log(this.validationString);
        }

      }
    })
  }

  newPasswordChange() {
    if (this.passwordPatternRegex.test(this.passwordReset.NEW_PASSWORD)) {
      this.newPasswordStatus = '';
    }
    else {
      this.newPasswordStatus = 'error';
    }
  }

  repeatPasswordChange() {
    if (this.passwordReset.NEW_PASSWORD == this.passwordReset.NEW_PASSWORD_REPEAT) {
      this.repeatPasswordStatus = '';
    }
    else {
      this.repeatPasswordStatus = 'error';
    }
  }

  // FR_SMALL_LETTERS!: number;
  // FR_CAPITAL_LETTERS!: number;
  // FR_NUMBERS!: number;
  // FR_SYMBOLS!: number;
  // PASSWORD_LENGTH!: number;
  // FR_PASSWORD_RESET!: number;
  // UPDATE_DATE!: Date;

  save() {

    if (!this.passwordReset.USER_NAME) {
      this.message.error("Please Provide Username", "");
      return;
    }

    if (!this.passwordReset.OLD_PASSWORD) {
      this.message.error("Please Provide Old Password", "");
      return;
    }

    if (!this.passwordPatternRegex.test(this.passwordReset.NEW_PASSWORD)) {
      this.message.error("Please Enter Password According to Pattern", this.validationString);
      return;
    }

    if (this.passwordReset.NEW_PASSWORD != this.passwordReset.NEW_PASSWORD_REPEAT) {
      this.message.error("New Password and Repeat Password Don't Match", "");
      return;
    }

    this.api.resetPassword(this.passwordReset.USER_NAME, this.passwordReset.OLD_PASSWORD, this.passwordReset.NEW_PASSWORD).subscribe({
      next: (res) => {
        if (res['code'] == 404) {
          this.message.error("Username or Old Password is wrong", "");
        }
        else if (res['code'] == 200) {
          this.passwordResetEvent.emit(true);
        }
        else {
          this.message.error("Failed to update password", "");
        }
      },
      error: () => {
        this.message.error("Failed to update password", "");
      }
    })
  }

}

class PasswordReset {
  OLD_PASSWORD!: string;
  NEW_PASSWORD!: string;
  NEW_PASSWORD_REPEAT!: string;
  USER_NAME!: string
}
