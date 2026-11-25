import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { Facilities } from 'src/app/models/facilities';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  serviceInfo: Facilities = new Facilities();

  APPLICANT_ID!: number;

  private _accountType: string = 'A';

  @Input()
  set AccountType(val: string) {
    this._accountType = val || 'A';
    this.updateChacked();
    this.changeInOption();
  }
  get AccountType(): string {
    return this._accountType;
  }

  isFd(): boolean {
    return ['D', 'E', 'F', 'G'].includes(this.AccountType);
  }

  checkOptionsOne: checkInterface[] = [];

  indeterminate = false;
  allChecked = false;

  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnInit(): void {
    this.updateChacked();
  }

  changeInOption() {
    let count = 0;
    for (let option of this.checkOptionsOne) {
      this.serviceInfo[option.value] = option.checked;
      if (option.checked) {
        count++;
      }
    }

    if (this.checkOptionsOne.length > 0 && count === this.checkOptionsOne.length) {
      this.indeterminate = false;
      this.allChecked = true;
    } else if (count === 0) {
      this.allChecked = false;
      this.indeterminate = false;
    } else {
      this.allChecked = false;
      this.indeterminate = true;
    }

    if (!this.serviceInfo.ATM_CARD) {
      const addOn = this.checkOptionsOne.find(o => o.value === 'ADDON_CARD');
      if (addOn) {
        addOn.checked = false;
      }
      this.serviceInfo.ADDON_CARD = false;
    }
  }

  updateAllChecked() {
    if (this.allChecked) {
      for (let option of this.checkOptionsOne) {
        option.checked = true;
      }
    } else {
      for (let option of this.checkOptionsOne) {
        option.checked = false;
      }
    }
    this.changeInOption();
  }

  save() {
    let service: Subject<any> = new Subject();

    if (this.isFd()) {
      // For FD / Term Deposits: Ensure only SMS_ALERT is kept, all others false
      this.serviceInfo.CHEQUE_BOOK = false;
      this.serviceInfo.PASS_BOOK = false;
      this.serviceInfo.STATEMENT_BY_EMAIL = false;
      this.serviceInfo.ATM_CARD = false;
      this.serviceInfo.CONSENT_NEW_PRODUCT = false;
      this.serviceInfo.ADDON_CARD = false;
      this.serviceInfo.UPI = false;
      this.serviceInfo.MOBILE_BANKING = false;
      this.serviceInfo.APPLICANT1_NAME = '';
      this.serviceInfo.APPLICANT2_NAME = '';
      this.serviceInfo.APPLICANT3_NAME = '';
      this.serviceInfo.APPLICANT4_NAME = '';
    }

    if (this.serviceInfo.ID) {
      this.api.updateService(this.serviceInfo).subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success("Service Information updated successfully!", '');
            this.getServiceInfo();
            service.next(res);
          }
          else {
            this.message.error('Failed to update Service info', '');
            service.next(res);
          }
        },
        error: (err) => {
          this.message.error("Internal Server Error!", err);
          service.error('err');
        },
        complete: () => {
          console.info("update Service Info Request Completed!");
          service.complete();
        }
      });
    }
    else {
      this.api.addService(this.serviceInfo).subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success("Service Information added successfully!", '');
            this.getServiceInfo();
            service.next(res);
          }
          else {
            this.message.error('Failed to add Service info', '');
            service.next(res);
          }
        },
        error: (err) => {
          this.message.error("Internal Server Error!", err);
          service.error('err');
        },
        complete: () => {
          console.info("Add Service Info Request Completed!");
          service.complete();
        }
      });
    }

    return service;
  }

  updateChacked() {
    if (this.isFd()) {
      // For FD: show ONLY SMS Alerts, hide all other options
      this.checkOptionsOne = [
        { label: 'SMS Alerts', checked: this.serviceInfo.SMS_ALERT ? true : false, value: 'SMS_ALERT' }
      ];
      this.serviceInfo.CHEQUE_BOOK = false;
      this.serviceInfo.PASS_BOOK = false;
      this.serviceInfo.STATEMENT_BY_EMAIL = false;
      this.serviceInfo.ATM_CARD = false;
      this.serviceInfo.CONSENT_NEW_PRODUCT = false;
      this.serviceInfo.ADDON_CARD = false;
      this.serviceInfo.UPI = false;
      this.serviceInfo.MOBILE_BANKING = false;
    } else {
      // Other accounts (Saving, Current, etc.): show existing options as it is
      this.checkOptionsOne = [
        { label: 'Cheque Book', checked: this.serviceInfo.CHEQUE_BOOK ? true : false, value: 'CHEQUE_BOOK' },
        { label: 'Passbook', checked: this.serviceInfo.PASS_BOOK ? true : false, value: 'PASS_BOOK' },
        { label: 'Statement By Email', checked: this.serviceInfo.STATEMENT_BY_EMAIL ? true : false, value: 'STATEMENT_BY_EMAIL' },
        { label: 'SMS Alerts', checked: this.serviceInfo.SMS_ALERT ? true : false, value: 'SMS_ALERT' },
        { label: 'Debit Cum ATM Card', checked: this.serviceInfo.ATM_CARD ? true : false, value: 'ATM_CARD' },
        { label: 'Consent to communicate new products', checked: this.serviceInfo.CONSENT_NEW_PRODUCT ? true : false, value: 'CONSENT_NEW_PRODUCT' },
        { label: 'Add on  Card', checked: this.serviceInfo.ADDON_CARD ? true : false, value: 'ADDON_CARD' },
        { label: 'UPI', checked: this.serviceInfo.UPI ? true : false, value: 'UPI' },
        { label: 'Mobile Banking', checked: this.serviceInfo.MOBILE_BANKING ? true : false, value: 'MOBILE_BANKING' },
      ];
    }
  }

  getServiceInfo() {
    if (this.APPLICANT_ID) {
      this.api.getDeposite(this.APPLICANT_ID).subscribe({
        next: (depRes) => {
          if (depRes?.code == 200 && depRes?.data?.length > 0 && depRes.data[0].ACCOUNT_TYPE) {
            this.AccountType = depRes.data[0].ACCOUNT_TYPE;
          }
        }
      });
    }

    this.api.getService(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.serviceInfo = res['data'][0];
          this.updateChacked();
          this.changeInOption();
        }
      },
      error: (err) => { },
      complete: () => { }
    });
  }
}

interface checkInterface {
  label: string;
  checked: boolean;
  value:
  | 'CHEQUE_BOOK'
  | 'PASS_BOOK'
  | 'STATEMENT_BY_EMAIL'
  | 'SMS_ALERT'
  | 'ATM_CARD'
  | 'CONSENT_NEW_PRODUCT'
  | 'ADDON_CARD'
  | 'UPI'
  | 'MOBILE_BANKING';
}
