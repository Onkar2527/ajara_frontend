import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { TermDeposite } from 'src/app/models/term-deposite';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  APPLICANT_ID!:number
  depositInfo: TermDeposite = new TermDeposite();
  account_type = 'S' 
  constructor(private api: ApiService, private message: NzNotificationService) { }
  ngOnInit(): void {
    
  }

  save() {
    let deposit: Subject<any> = new Subject();

    if (this.depositInfo.ID) {
      this.api.updateDeposite(this.depositInfo).subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.getDepositInfo();
            this.message.success("Deposite Information updated successfully!", '');
            deposit.next(res);
          }
          else {
            this.message.error('Failed to update Deposite info', '');
            deposit.next(res);
          }
        },
        error: (err) => {
          this.message.error("Internal Server Error!", err);
          deposit.error('err')
        },
        complete: () => {
          console.info("update Deposite Info Request Completed!");
          deposit.complete();
        }
      })
    }

    else {
      this.api.addDeposite(this.depositInfo).subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.getDepositInfo();
            this.message.success("Deposite Information added successfully!", '');
            deposit.next(res);
          }
          else {
            this.message.error('Failed to add Deposite info', '');
            deposit.next(res);
          }
        },
        error: (err) => {
          this.message.error("Internal Server Error!", err);
          deposit.error('err')
        },
        complete: () => {
          console.info("Add Deposite Info Request Completed!");
          deposit.complete();
        }
      })
    }

    return deposit;

  }

  getDepositInfo() {
    this.api.getDeposite(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.depositInfo = res['data'][0];
          this.depositInfo.ACCOUNT_TYPE = this.account_type;
        }
        else {

        }
      },
      error: (err) => {

      },
      complete: () => {

      }
    });

  }
}
