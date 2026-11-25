import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { Financial } from 'src/app/models/financial';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-applicant-financial',
  templateUrl: './applicant-financial.component.html',
  styleUrls: ['./applicant-financial.component.css']
})
export class ApplicantFinancialComponent implements OnInit {

  @Input() APPLICANT_ID?: number;
  @Input() APPLICANT_NO?: number;

  financialInfo: Financial = new Financial();

  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnInit(): void {
  }

  incomeList = [
    {
      label: 'Upto ₹60000',
      value: 'A'
    },
    {
      label: '₹60001 to ₹120000',
      value: 'B'
    },
    {
      label: '₹120001 to ₹240000',
      value: 'C'
    },
    {
      label: '₹240001 to ₹360000',
      value: 'D'
    },
    {
      label: '₹360001 to ₹600000',
      value: 'E'
    },
    {
      label: '₹600001 to ₹1200000',
      value: 'F'
    },
    {
      label: '₹1200001 to ₹1800000',
      value: 'G'
    },
    {
      label: 'Above ₹1800000',
      value: 'H'
    }
  ];

  getApplicantFinacial() {
    this.api.getFinancial(this.APPLICANT_ID, this.APPLICANT_NO).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.financialInfo = res['data'][0];
        }
      },
      error: () => { },
      complete: () => { }
    });
  }

  validateNumberOnly(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    // Disallow negative sign (- is 45) and other non-digits, allow only digits 0-9 (48 to 57)
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  onIncomeInput() {
    if (this.financialInfo.INCOME !== undefined && this.financialInfo.INCOME !== null) {
      let sanitized = this.financialInfo.INCOME.toString().replace(/[^0-9]/g, '');
      // Strip leading zeroes if length > 1 (e.g. "0500" -> "500")
      sanitized = sanitized.replace(/^0+(?!$)/, '');
      this.financialInfo.INCOME = sanitized;
    }
  }

  save() {
    let financial: Subject<any> = new Subject();

    const incomeStr = this.financialInfo.INCOME !== undefined && this.financialInfo.INCOME !== null
      ? this.financialInfo.INCOME.toString().trim()
      : '';
    const incomeNum = Number(incomeStr);

    if (!incomeStr) {
      this.message.error("Annual Income is Mandatory", '');
      financial.error("Annual Income is Mandatory");
      return financial;
    }

    if (isNaN(incomeNum) || incomeNum <= 0) {
      this.message.error("Annual Income must be a positive number greater than 0", '');
      financial.error("Annual Income must be a positive number greater than 0");
      return financial;
    }

    this.financialInfo.INCOME = incomeNum.toString();

    if (this.financialInfo.ID) {
      this.api.updateFinancial(this.financialInfo).subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success("Financial Information updated successfully!", '');
            this.getApplicantFinacial();
            financial.next(res);
          } else {
            this.message.error('Failed to update Financial info', '');
            financial.next(res);
          }
        },
        error: (err) => {
          this.message.error("Internal Server Error!", err);
          financial.error('err');
        },
        complete: () => {
          console.info("Update Financial Info Request Completed!");
          financial.complete();
        }
      });
    } else {
      this.financialInfo.APPLICANT_ID = this.APPLICANT_ID;
      this.financialInfo.APPLICANT_NO = this.APPLICANT_NO;

      this.api.createFinancial(this.financialInfo).subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success("Financial Information created successfully!", '');
            this.getApplicantFinacial();
            financial.next(res);
          } else {
            this.message.error('Failed to create Financial info', '');
            financial.next(res);
          }
        },
        error: (err) => {
          this.message.error("Internal Server Error!", err);
          financial.error('err');
        },
        complete: () => {
          console.info("Add Financial Info Request Completed!");
          financial.complete();
        }
      });
    }
    return financial;
  }
}
