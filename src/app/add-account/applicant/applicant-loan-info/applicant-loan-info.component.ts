import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { LoanInfo } from 'src/app/models/loan-info';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-applicant-loan-info',
  templateUrl: './applicant-loan-info.component.html',
  styleUrls: ['./applicant-loan-info.component.css']
})
export class ApplicantLoanInfoComponent implements OnInit {
  loanInfo: LoanInfo = new LoanInfo();

  @Input() APPLICANT_ID?: number
  @Input() APPLICANT_NO?: number

  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnInit(): void {

  }

  getApplicantLoanInfo() {
    this.api.getLoanInfo(this.APPLICANT_ID, this.APPLICANT_NO).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.loanInfo = res['data'][0]
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
    let loanInfo: Subject<any> = new Subject();

    if (this.loanInfo.ID) {
      this.api.updateLoanInfo(this.loanInfo).subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success("Loan Information updated successfully!", '');
            this.getApplicantLoanInfo();
            loanInfo.next(res);
          }
          else {
            this.message.error('Failed to update Loan info', '');
            loanInfo.next(res);
          }
        },
        error: (err) => {
          this.message.error("Internal Server Error!", err);
          loanInfo.error('err')
        },
        complete: () => {
          console.info("Add loan Info Request Completed!");
          loanInfo.complete();
        }
      })
    }
    else {
      this.loanInfo.APPLICANT_ID = this.APPLICANT_ID;
      this.loanInfo.APPLICANT_NO = this.APPLICANT_NO;

      this.api.createLoanInfo(this.loanInfo).subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success("Loan Information created successfully!", '');
            this.getApplicantLoanInfo();
            loanInfo.next(res);
          }
          else {
            this.message.error('Failed to create Loan info', '');
            loanInfo.next(res);
          }
        },
        error: (err) => {
          this.message.error("Internal Server Error!", err);
          loanInfo.error('err')
        },
        complete: () => {
          console.info("Add loan Info Request Completed!");
          loanInfo.complete();
        }
      })
    }
    return loanInfo;
  }
  
}
