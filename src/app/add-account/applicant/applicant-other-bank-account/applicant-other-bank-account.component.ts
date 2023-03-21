import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { OtherBankAccount } from 'src/app/models/other-bank-account';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-applicant-other-bank-account',
  templateUrl: './applicant-other-bank-account.component.html',
  styleUrls: ['./applicant-other-bank-account.component.css']
})
export class ApplicantOtherBankAccountComponent implements OnInit {

  accountInfo : OtherBankAccount = new OtherBankAccount();
  @Input() APPLICANT_ID?: number
  @Input() APPLICANT_NO?: number

  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnInit(): void {

  }

  getApplicantOtherBankAccount() {
    this.api.getOtherAccount(this.APPLICANT_ID, this.APPLICANT_NO).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.accountInfo = res['data'][0]
        }
        else {

        }
      },
      error: () => {

      },
      complete: () => {

      }
    })
  }

  save() {
    let otherAccount: Subject<any> = new Subject();

    if (this.accountInfo.ID) {
      this.api.updateOtherAccount(this.accountInfo).subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success("Other Account Information updated successfully!", '');
            this.getApplicantOtherBankAccount();
            otherAccount.next(res);
          }
          else {
            this.message.error('Failed to update Other Account info', '');
            otherAccount.next(res);
          }
        },
        error: (err) => {
          this.message.error("Internal Server Error!", err);
          otherAccount.error('err')
        },
        complete: () => {
          console.info("Add Other Account Info Request Completed!");
          otherAccount.complete();
        }
      })
    }
    else {
      this.accountInfo.APPLICANT_ID = this.APPLICANT_ID;
      this.accountInfo.APPLICANT_NO = this.APPLICANT_NO;

      this.api.createOtherAccount(this.accountInfo).subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success("Other Account Information created successfully!", '');
            this.getApplicantOtherBankAccount();
            otherAccount.next(res);
          }
          else {
            this.message.error('Failed to create Other Account info', '');
            otherAccount.next(res);
          }
        },
        error: (err) => {
          this.message.error("Internal Server Error!", err);
          otherAccount.error('err')
        },
        complete: () => {
          console.info("Add Other Account Info Request Completed!");
          otherAccount.complete();
        }
      })
    }
    return otherAccount;
  }

}
