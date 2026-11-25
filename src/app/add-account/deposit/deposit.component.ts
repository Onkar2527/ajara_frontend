import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, lastValueFrom } from 'rxjs';
import { TermDeposite } from 'src/app/models/term-deposite';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css'],
})
export class DepositComponent implements OnInit {
  APPLICANT_ID!: number;
  depositInfo: TermDeposite = new TermDeposite();
  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) { }
  ngOnInit(): void {
    this.getMasters();
    this.changeCatagory();
  }

  mendetory_all = [
    { field: 'ACCOUNT_TYPE', message: 'Account Type' },
    { field: 'ACCOUNT_OPERATION', message: 'Account Operation' },
    { field: 'PAYMENT_INSTRUCTION', message: 'Payment Instruction' },
  ];

  mendetory_saving = [{ field: 'SCHEME_CODE', message: 'Sub Account Type' }];

  mendetory_saving_cheque = [
    { field: 'TRANSFER_ACCOUNT_NO', message: 'Account Number' },
    { field: 'CHEQUE_BANK_NAME', message: 'Bank Name' },
    { field: 'CHEQUE_BRANCH_NAME', message: 'Branch Name' },
    { field: 'CHAQUE_NO', message: 'Cheque Number' },
    { field: 'TRANSFER_DATE', message: 'Cheque Date' },
  ];

  mendetory_non_saving = [
    { field: 'DEPOSIT_AMOUNT', message: 'Deposit Amount' },
    { field: 'RATE_OF_INTEREST', message: 'Rate of Interest' },
    { field: 'DEPOSIT_BANK_NAME', message: 'Bank Name' },
    { field: 'DEPOSIT_BRANCH_NAME', message: 'Branch Name' },
    { field: 'DEPOSIT_IFSC_CODE', message: 'IFSC Code' },
    { field: 'DEPOSIT_ACCOUNT_NUMBER', message: 'Account Number' },
  ];

  catagoryA = false;
  catagoryB = false;

  getAccountCatA() {
    let con =
      ['A', 'B', 'G', 'C', 'H'].indexOf(this.depositInfo.ACCOUNT_TYPE) + 1
        ? true
        : false;

    this.catagoryA = con;
  }

  getAccountCatB() {
    let con =
      ['D', 'E', 'F'].indexOf(this.depositInfo.ACCOUNT_TYPE) + 1 ? true : false;

    this.catagoryB = con;
  }

  changeCatagory() {
    this.getAccountCatA();
    this.getAccountCatB();
    this.changeScheme();
    this.depositInfo.SCHEME_CODE_NEW = this.depositInfo.SCHEME_CODE;

  }

  MASTERS = [
    { id: 18, data: <any>[], name: 'scheme' },
    { id: 21, data: <any>[], name: 'operation' },
    { id: 22, data: <any>[], name: 'payment instruction' },
    { id: 23, data: <any>[], name: 'minimum balance category' },
  ];

  selectedSchemeCode: string = '';

  // changeCategory() {
  //   this.selectedSchemeCode = this.depositInfo.SCHEME_CODE;
  // }

  changeCategory() {
    this.depositInfo.SCHEME_CODE_NEW = this.depositInfo.SCHEME_CODE;
  }

  schemeMaster = <any>[];

  async getMasters() {
    for (let i = 0; i < this.MASTERS.length; i++) {
      let result = await lastValueFrom(this.api.getMasters(this.MASTERS[i].id));

      if (result['code'] == 200 && result['data'].length > 0) {
        this.MASTERS[i].data = result['data'];
      }
    }
    this.changeScheme();
    console.log('MASTERS', this.MASTERS);
  }

  schemes: any = [];

  changeScheme() {
    if (this.depositInfo.ACCOUNT_TYPE == 'A') {
      this.schemes = this.MASTERS[0].data.filter(
        (value: any) => value.SMP_MNACTYPE == 'SB'
      );
      // Fetch Interest Rate from CBS based on selected Scheme Code
      if (this.depositInfo.SCHEME_CODE) {
        let bankCode = sessionStorage.getItem('BANK_CODE') || '1';
        let branchCode = sessionStorage.getItem('BRANCH_ID') || '1';
        let staff = sessionStorage.getItem('USER_ID') || '';

        // Date format converted to dd-mm-yyyy for CBS compatibility
        const today = new Date();
        const date = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

        console.log(`Fetching interest interest rate for Scheme: ${this.depositInfo.SCHEME_CODE}, Date: ${date}`);

        this.api
          .getInterestRateForSaving(
            bankCode,
            branchCode,
            this.depositInfo.SCHEME_CODE,
            date,
            staff
          )
          .subscribe((res) => {
            if (res['code'] == 200 && res['data']) {
              // Handle both array and object response structure from CBS
              const responseData = Array.isArray(res['data']) ? res['data'][0] : res['data'];
              if (responseData && responseData.RATE) {
                this.depositInfo.RATE_OF_INTEREST_SAVING = responseData.RATE;
                console.log("Updated Interest Rate from CBS:", responseData.RATE);
              } else {
                console.warn("Interest rate field not found in API response", res['data']);
              }
            } else {
              console.error("Failed to fetch interest rate from API", res);
            }
          });
      } else {
        // Reset to default if no scheme selected
        this.depositInfo.RATE_OF_INTEREST_SAVING = 2.50;
      }
    } else if (this.depositInfo.ACCOUNT_TYPE == 'C') {
      this.schemes = this.MASTERS[0].data.filter(
        (value: any) => value.SMP_MNACTYPE == 'CA'
      );
    } else if (
      this.depositInfo.ACCOUNT_TYPE == 'D' ||
      this.depositInfo.ACCOUNT_TYPE == 'E'
    ) {
      this.schemes = this.MASTERS[0].data.filter(
        (value: any) => value.SMP_MNACTYPE == 'FD'
      );
    } else if (this.depositInfo.ACCOUNT_TYPE == 'F') {
      this.schemes = this.MASTERS[0].data.filter(
        (value: any) => value.SMP_MNACTYPE == 'RA' || value.SMP_MNACTYPE == 'RP'
      );
    } else if (this.depositInfo.ACCOUNT_TYPE == 'G') {
      this.schemes = this.MASTERS[0].data.filter(
        (value: any) => value.SMP_MNACTYPE == 'PG'
      );
    } else {
      this.schemes = [];
    }
  }

  save() {
    let deposit: Subject<any> = new Subject();

    let isOk = true;

    for (let field of this.mendetory_all) {
      if (field.field === 'INITIAL_AMOUNT') {
        const initAmt = Number(this.depositInfo.INITIAL_AMOUNT);
        if (this.depositInfo.INITIAL_AMOUNT == null || this.depositInfo.INITIAL_AMOUNT === ('' as any) || isNaN(initAmt) || initAmt <= 0) {
          this.message.error('Initial Amount must be a valid positive number', '');
          isOk = false;
        }
      } else if (!this.depositInfo[field.field as keyof TermDeposite]) {
        this.message.error(`${field.message} is Mandatory`, '');
        isOk = false;
      }
    }

    if (this.catagoryA) {
      if (!this.depositInfo.INITIAL_AMOUNT) {
        this.message.error('Initial Amount is Mandatory', '');
        isOk = false;
      }
    }

    if (this.depositInfo.ACCOUNT_TYPE == 'A') {
      for (let field of this.mendetory_saving) {
        if (!this.depositInfo[field.field as keyof TermDeposite]) {
          this.message.error(`${field.message} is Mandatory`, '');
          isOk = false;
        }
      }
    }

    if (this.catagoryA && this.depositInfo.MODE_OF_PAYMENT == 'T') {
      for (let field of this.mendetory_saving_cheque) {
        if (!this.depositInfo[field.field as keyof TermDeposite]) {
          this.message.error(`${field.message} is Mandatory`, '');
          isOk = false;
        }
      }
    }

    if (this.catagoryB) {
      if (this.depositInfo.DEPOSIT_AMOUNT != null) {
        this.depositInfo.INITIAL_AMOUNT = Number(this.depositInfo.DEPOSIT_AMOUNT);
      }
      for (let field of this.mendetory_non_saving) {
        if (field.field === 'DEPOSIT_AMOUNT') {
          const depAmt = Number(this.depositInfo.DEPOSIT_AMOUNT);
          if (this.depositInfo.DEPOSIT_AMOUNT == null || this.depositInfo.DEPOSIT_AMOUNT === ('' as any) || isNaN(depAmt) || depAmt <= 0) {
            this.message.error('Deposit Amount must be a valid positive number', '');
            isOk = false;
          }
        } else if (!this.depositInfo[field.field as keyof TermDeposite]) {
          this.message.error(`${field.message} is Mandatory`, '');
          isOk = false;
        }
      }
    }

    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (this.depositInfo.DEPOSIT_IFSC_CODE) {
      const formattedIfsc = this.depositInfo.DEPOSIT_IFSC_CODE.trim().toUpperCase();
      this.depositInfo.DEPOSIT_IFSC_CODE = formattedIfsc;
      if (!ifscRegex.test(formattedIfsc)) {
        this.message.error(
          'Invalid IFSC Code format. Must be 11 characters (e.g. SBIN0001234): first 4 letters, 5th character 0, and last 6 alphanumeric.',
          ''
        );
        isOk = false;
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
              this.message.success(
                'Deposite Information updated successfully!',
                ''
              );
              deposit.next(res);
            } else {
              this.message.error('Failed to update Deposite info', '');
              deposit.next(res);
            }
          },
          error: (err) => {
            this.message.error('Internal Server Error!', err);
            deposit.error('err');
          },
          complete: () => {
            console.info('update Deposite Info Request Completed!');
            deposit.complete();
          },
        });
      } else {
        this.api.addDeposite(this.depositInfo).subscribe({
          next: (res) => {
            if (res.code == 200) {
              this.getDepositInfo();
              this.message.success(
                'Deposite Information added successfully!',
                ''
              );
              deposit.next(res);
            } else {
              this.message.error('Failed to add Deposite info', '');
              deposit.next(res);
            }
          },
          error: (err) => {
            this.message.error('Internal Server Error!', err);
            deposit.error('err');
          },
          complete: () => {
            console.info('Add Deposite Info Request Completed!');
            deposit.complete();
          },
        });
      }
    } else {
      deposit.error('All mendetory fields are not filled');
    }

    return deposit;
  }

  getDepositInfo() {
    this.api.getDeposite(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.depositInfo = res['data'][0];
          this.changeCatagory();
        } else {
        }
      },
      error: (err) => { },
      complete: () => { },
    });
  }

  getSavingInterestDisplay(): string {
    return this.depositInfo.RATE_OF_INTEREST_SAVING
      ? Number(this.depositInfo.RATE_OF_INTEREST_SAVING).toFixed(2)
      : '2.50';
  }

  validateNumberOnly(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    // Disallow negative sign (- is 45) and all characters, allow only digits 0-9 (48 to 57)
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  onPasteNumberOnly(event: ClipboardEvent, field: 'INITIAL_AMOUNT' | 'DEPOSIT_AMOUNT'): void {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;
    const pastedText = clipboardData.getData('text') || '';
    const clean = pastedText.replace(/[^0-9]/g, '');
    if (clean) {
      this.depositInfo[field] = Number(clean);
    }
  }

  onInitialAmountChange(val: any): void {
    if (val === null || val === undefined || val === '') {
      this.depositInfo.INITIAL_AMOUNT = null as any;
      return;
    }
    const clean = String(val).replace(/[^0-9]/g, '');
    this.depositInfo.INITIAL_AMOUNT = clean !== '' ? Number(clean) : (null as any);
  }

  onDepositAmountChange(val: any): void {
    if (val === null || val === undefined || val === '') {
      this.depositInfo.DEPOSIT_AMOUNT = null as any;
      return;
    }
    const clean = String(val).replace(/[^0-9]/g, '');
    this.depositInfo.DEPOSIT_AMOUNT = clean !== '' ? Number(clean) : (null as any);
  }

  isInitialAmountInvalid(): boolean {
    if (this.depositInfo.INITIAL_AMOUNT == null || this.depositInfo.INITIAL_AMOUNT === ('' as any)) {
      return false;
    }
    const val = Number(this.depositInfo.INITIAL_AMOUNT);
    return isNaN(val) || val <= 0;
  }

  isDepositAmountInvalid(): boolean {
    if (this.depositInfo.DEPOSIT_AMOUNT == null || this.depositInfo.DEPOSIT_AMOUNT === ('' as any)) {
      return false;
    }
    const val = Number(this.depositInfo.DEPOSIT_AMOUNT);
    return isNaN(val) || val <= 0;
  }
}

