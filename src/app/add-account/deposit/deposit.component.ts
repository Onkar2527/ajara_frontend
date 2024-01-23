import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, lastValueFrom } from 'rxjs';
import { TermDeposite } from 'src/app/models/term-deposite';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  APPLICANT_ID!: number
  depositInfo: TermDeposite = new TermDeposite();
  constructor(private api: ApiService, private message: NzNotificationService) { }
  ngOnInit(): void {
    this.getMasters();
  }

  mendetory_all = [
    { field: 'ACCOUNT_TYPE', message: 'Account Type' },
    { field: 'ACCOUNT_OPERATION', message: 'Account Operation' },
    { field: 'INITIAL_AMOUNT', message: 'Initial Amount' },
    { field: 'PAYMENT_INSTRUCTION', message: 'Payment Instruction' }
  ]

  mendetory_saving = [

  ]

  mendetory_saving_cheque = [
    { field: 'TRANSFER_ACCOUNT_NO', message: 'Account Number' },
    { field: 'CHEQUE_BANK_NAME', message: 'Bank Name' },
    { field: 'CHEQUE_BRANCH_NAME', message: 'Branch Name' },
    { field: 'CHAQUE_NO', message: 'Cheque Number' },
    { field: 'TRANSFER_DATE', message: 'Cheque Date' }
  ]

  mendetory_non_saving = [
    { field: 'DEPOSIT_AMOUNT', message: 'Deposit Amount' },
    { field: 'RATE_OF_INTEREST', message: 'Rate of Interest' },
    { field: 'DEPOSIT_BANK_NAME', message: 'Bank Name' },
    { field: 'DEPOSIT_BRANCH_NAME', message: 'Branch Name' },
    { field: 'DEPOSIT_IFSC_CODE', message: 'IFSC Code' },
    { field: 'DEPOSIT_ACCOUNT_NUMBER', message: 'Account Number' }
  ]

  catagoryA = false;
  catagoryB = false;

  getAccountCatA() {
    let con = (['A', 'B', 'G', 'C', 'H'].indexOf(this.depositInfo.ACCOUNT_TYPE) + 1) ? true : false;

    this.catagoryA = con
  }

  getAccountCatB() {
    let con = (['D', 'E', 'F'].indexOf(this.depositInfo.ACCOUNT_TYPE) + 1) ? true : false;

    this.catagoryB = con
  }

  changeCatagory() {
    this.getAccountCatA();
    this.getAccountCatB();
    this.changeScheme();
  }

  MASTERS = [
    { id: 18, data: <any>[], name: "scheme" },
    { id: 21, data: <any>[], name: "operation" },
    { id: 22, data: <any>[], name: "payment instruction" },
  ]

  schemeMaster = <any>[]

  async getMasters() {

    for (let i = 0; i < this.MASTERS.length; i++) {
      let result = await lastValueFrom(this.api.getMasters(this.MASTERS[i].id));

      if (result['code'] == 200 && result["data"].length > 0) {
        this.MASTERS[i].data = result['data'];
      }
    }
    this.changeScheme();
    console.log('MASTERS', this.MASTERS);

  }

  schemes: any = []

  changeScheme() {
    if (this.depositInfo.ACCOUNT_TYPE == "A") {
      this.schemes = this.MASTERS[0].data.filter((value: any) => value.SMP_MNACTYPE == "SB")
    }

    else {
      this.schemes = []
    }
  }

  save() {
    let deposit: Subject<any> = new Subject();

    let isOk = true;

    for (let field of this.mendetory_all) {
      if (!this.depositInfo[field.field as keyof TermDeposite]) {
        this.message.error(`${field.message} is Mandetory`, '');
        isOk = false;
      }
    }


    // for (let field of this.mendetory_saving) {
    //   if (!this.depositInfo[field.field as keyof TermDeposite]) {
    //     this.message.error(`${field.message} is Mandetory`, '');
    //     isOk = false;
    //   }
    // }

    if (this.depositInfo.MODE_OF_PAYMENT == 'T') {
      for (let field of this.mendetory_saving_cheque) {
        if (!this.depositInfo[field.field as keyof TermDeposite]) {
          this.message.error(`${field.message} is Mandetory`, '');
          isOk = false;
        }
      }
    }



    if (this.catagoryB) {
      for (let field of this.mendetory_non_saving) {
        if (!this.depositInfo[field.field as keyof TermDeposite]) {
          this.message.error(`${field.message} is Mandetory`, '');
          isOk = false;
        }
      }
    }

    if (this.depositInfo.ACCOUNT_TYPE == 'F') {
      this.depositInfo.AUTO_RENEWAL = false;
    }

    if (isOk) {
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
    }
    else {
      deposit.error("All mendetory fields are not filled");
    }

    return deposit;

  }

  getDepositInfo() {
    this.api.getDeposite(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.depositInfo = res['data'][0];
          this.changeCatagory()
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
