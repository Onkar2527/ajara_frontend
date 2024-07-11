import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-password-policy-manager',
  templateUrl: './password-policy-manager.component.html',
  styleUrls: ['./password-policy-manager.component.css']
})
export class PasswordPolicyManagerComponent implements OnInit {

  passwordPolicy: PasswordPolicy = new PasswordPolicy();

  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnInit(): void {
    this.get();
  }

  get() {
    this.api.getPasswordPolicyData().subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.passwordPolicy = res['data'];
        }
      }
    });
  }

  save() {
    this.api.savePasswordPolicyData(this.passwordPolicy).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.message.success("Password Policy Updated", "");
          this.get();
        }
        else {
          this.message.error("Failed to update password policy", "");
        }
      },
      error: () => {
        this.message.error("Failed to update password policy", "");
      }
    })
  }

}


class PasswordPolicy {
  FR_SMALL_LETTERS!: number;
  FR_CAPITAL_LETTERS!: number;
  FR_NUMBERS!: number;
  FR_SYMBOLS!: number;
  PASSWORD_LENGTH!: number;
  FR_PASSWORD_RESET!: number;
  UPDATE_DATE!: Date;
}
