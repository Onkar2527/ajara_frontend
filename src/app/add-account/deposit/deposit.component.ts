import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, lastValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
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
    this.initDaysSubscription();
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
    if (!this.isReviewMode()) {
      if (this.depositInfo.ACCOUNT_TYPE === 'A' || (this.depositInfo.TANURE_DAYS !== undefined && this.depositInfo.TANURE_DAYS !== null && String(this.depositInfo.TANURE_DAYS).trim() !== '')) {
        this.fetchInterestRate();
      }
    }
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
  isLoadingInterest: boolean = false;
  private daysChangeSubject = new Subject<any>();

  initDaysSubscription() {
    this.daysChangeSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.fetchInterestRate();
      });
  }

  onDaysChange(val?: any) {
    if (val !== undefined) {
      if (val === null || val === '') {
        this.depositInfo.TANURE_DAYS = null as any;
      } else {
        const clean = String(val).replace(/[^0-9]/g, '');
        if (clean === '') {
          this.depositInfo.TANURE_DAYS = null as any;
        } else {
          let num = Number(clean);
          if (num > 31) {
            num = 31;
          }
          this.depositInfo.TANURE_DAYS = num;
        }
      }
    }
    if (this.catagoryB && this.depositInfo.SCHEME_CODE) {
      if (
        this.depositInfo.TANURE_DAYS !== undefined &&
        this.depositInfo.TANURE_DAYS !== null &&
        String(this.depositInfo.TANURE_DAYS).trim() !== ''
      ) {
        this.daysChangeSubject.next(this.depositInfo.TANURE_DAYS);
      }
    }
  }

  onDaysBlur() {
    if (this.depositInfo.TANURE_DAYS != null && this.depositInfo.TANURE_DAYS !== ('' as any)) {
      let num = Number(this.depositInfo.TANURE_DAYS);
      if (num > 31) {
        this.depositInfo.TANURE_DAYS = 31;
      } else if (num < 0) {
        this.depositInfo.TANURE_DAYS = 0;
      }
    }
    if (this.catagoryB && this.depositInfo.SCHEME_CODE) {
      if (
        this.depositInfo.TANURE_DAYS !== undefined &&
        this.depositInfo.TANURE_DAYS !== null &&
        String(this.depositInfo.TANURE_DAYS).trim() !== ''
      ) {
        this.fetchInterestRate();
      }
    }
  }

  isReviewMode(): boolean {
    const roleId = Number(sessionStorage.getItem('ROLE_ID'));
    // Role 2: Checker (BM), Role 3: Verifier (CPC), Role 4: Admin
    return roleId === 2 || roleId === 3 || roleId === 4;
  }

  fetchInterestRate() {
    // In BM (Checker), CPC (Verifier), or Admin mode, do NOT call the live interest rate API.
    // The interest rate, maturity amount, and maturity date are already saved in DB by BA.
    if (this.isReviewMode()) {
      return;
    }
    if (!this.depositInfo.SCHEME_CODE) {
      if (this.depositInfo.ACCOUNT_TYPE == 'A') {
        this.depositInfo.RATE_OF_INTEREST_SAVING = 2.50;
      }
      return;
    }

    let bankCode = sessionStorage.getItem('BANK_CODE') || '1';
    let branchCode = sessionStorage.getItem('BRANCH_ID') || '1';
    let staff = sessionStorage.getItem('USER_ID') || 'N';

    const today = new Date();
    const accOpenDt = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

    let params: any = {
      bankCode: bankCode,
      branchCode: branchCode,
      accOpenDt: accOpenDt,
      staff: staff ? staff : 'N',
      schemeCode: this.depositInfo.SCHEME_CODE,
      years: 0,
      months: 0,
      days: 0,
      amount: 0,
      pigmiInstlFreq: '',
      splct: '',
      accSpecCtg: '',
      discFreq: '',
      guardianId: ''
    };

    if (this.depositInfo.ACCOUNT_TYPE == 'A') {
      params.amount = this.depositInfo.INITIAL_AMOUNT ? Number(this.depositInfo.INITIAL_AMOUNT) : 0;
    } else if (
      this.depositInfo.ACCOUNT_TYPE == 'D' ||
      this.depositInfo.ACCOUNT_TYPE == 'E' ||
      this.depositInfo.ACCOUNT_TYPE == 'F'
    ) {
      // Only call interest API for FD/RA when Days value is input
      if (
        this.depositInfo.TANURE_DAYS === undefined ||
        this.depositInfo.TANURE_DAYS === null ||
        String(this.depositInfo.TANURE_DAYS).trim() === ''
      ) {
        return;
      }

      params.years = Number(this.depositInfo.TANURE_YEARS) || 0;
      params.months = Number(this.depositInfo.TANURE_MONTHS) || 0;
      params.days = Number(this.depositInfo.TANURE_DAYS) || 0;
      params.amount = Number(this.depositInfo.DEPOSIT_AMOUNT) || 0;
      params.discFreq = this.depositInfo.INTEREST_PAYOUT || '';
    } else if (this.depositInfo.ACCOUNT_TYPE == 'G') {
      params.amount = Number(this.depositInfo.DEPOSIT_AMOUNT) || 0;
      params.pigmiInstlFreq = this.depositInfo.DEPOSIT_FREQUANCY || '';
    }

    this.isLoadingInterest = true;
    console.log(`Fetching Interest Rate for Account Type: ${this.depositInfo.ACCOUNT_TYPE}, Scheme: ${this.depositInfo.SCHEME_CODE}`, params);

    this.api.getInterestRateForAllAcc(params).subscribe({
      next: (res) => {
        this.isLoadingInterest = false;
        if (res && (res.code == 200 || res.code == '200') && res.data) {
          const responseData = Array.isArray(res.data) ? res.data[0] : res.data;
          const rate = responseData.interestRate !== undefined ? responseData.interestRate : responseData.RATE;

          if (this.depositInfo.ACCOUNT_TYPE == 'A') {
            if (rate !== undefined && rate !== null) {
              this.depositInfo.RATE_OF_INTEREST_SAVING = Number(rate);
              console.log("Updated Saving Interest Rate from CBS:", responseData);
            }
          } else {
            if (rate !== undefined && rate !== null) {
              this.depositInfo.RATE_OF_INTEREST = Number(rate);
              console.log("Updated FD/RA Interest Rate from CBS:", rate);
            }
            if (responseData.maturityAmount !== undefined && responseData.maturityAmount !== null) {
              this.depositInfo.MATURITY_AMOUNT = String(responseData.maturityAmount);
            }
            if (responseData.maturityDate) {
              this.depositInfo.MATURITY_DATE = String(responseData.maturityDate);
            }
          }
        } else {
          console.warn("Failed or invalid response fetching interest rate:", res);
        }
      },
      error: (err) => {
        this.isLoadingInterest = false;
        console.error("Error fetching interest rate from API:", err);
      }
    });
  }

  changeScheme(autoFetch: boolean = false) {
    if (this.depositInfo.ACCOUNT_TYPE == 'A') {
      this.schemes = this.MASTERS[0].data.filter(
        (value: any) => value.SMP_MNACTYPE == 'SB'
      );
      if (autoFetch && !this.isReviewMode()) {
        this.fetchInterestRate();
      }
    } else if (this.depositInfo.ACCOUNT_TYPE == 'C') {
      this.schemes = this.MASTERS[0].data.filter(
        (value: any) => value.SMP_MNACTYPE == 'CA'
      );
    } else if (this.depositInfo.ACCOUNT_TYPE == 'D') {
      // Fixed Deposit: filter by FD
      this.schemes = this.MASTERS[0].data.filter(
        (value: any) => value.SMP_MNACTYPE == 'FD'
      );
      if (autoFetch && !this.isReviewMode()) {
        if (this.depositInfo.TANURE_DAYS !== undefined && this.depositInfo.TANURE_DAYS !== null && String(this.depositInfo.TANURE_DAYS).trim() !== '') {
          this.fetchInterestRate();
        }
      }
    } else if (this.depositInfo.ACCOUNT_TYPE == 'E') {
      // Fixed Deposit (Reinvestment): filter by RP (Reinvestment Plans)
      this.schemes = this.MASTERS[0].data.filter(
        (value: any) => value.SMP_MNACTYPE == 'RP'
      );
      if (autoFetch && !this.isReviewMode()) {
        if (this.depositInfo.TANURE_DAYS !== undefined && this.depositInfo.TANURE_DAYS !== null && String(this.depositInfo.TANURE_DAYS).trim() !== '') {
          this.fetchInterestRate();
        }
      }
    } else if (this.depositInfo.ACCOUNT_TYPE == 'F') {
      // Recurring Deposit: filter by RA
      this.schemes = this.MASTERS[0].data.filter(
        (value: any) => value.SMP_MNACTYPE == 'RA'
      );
      if (autoFetch && !this.isReviewMode()) {
        if (this.depositInfo.TANURE_DAYS !== undefined && this.depositInfo.TANURE_DAYS !== null && String(this.depositInfo.TANURE_DAYS).trim() !== '') {
          this.fetchInterestRate();
        }
      }
    } else if (this.depositInfo.ACCOUNT_TYPE == 'G') {
      this.schemes = this.MASTERS[0].data.filter(
        (value: any) => value.SMP_MNACTYPE == 'PG'
      );
      if (autoFetch && !this.isReviewMode()) {
        this.fetchInterestRate();
      }
    } else {
      this.schemes = [];
    }

    // Reset scheme selection if current scheme does not belong to new schemes list
    if (this.schemes && this.schemes.length > 0) {
      const exists = this.schemes.some((s: any) => s.SMP_CODE == this.depositInfo.SCHEME_CODE);
      if (!exists) {
        this.depositInfo.SCHEME_CODE = '';
        this.depositInfo.SCHEME_CODE_NEW = '';
      }
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
      if (this.isYearInvalid()) {
        this.message.error('Period Years must be 0 or more', '');
        isOk = false;
      }
      if (this.isMonthInvalid()) {
        this.message.error('Period Months must be between 0 and 12', '');
        isOk = false;
      }
      if (this.isDayInvalid()) {
        this.message.error('Period Days must be between 0 and 31', '');
        isOk = false;
      }
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

    // Bank Details section is hidden for deposit: clear them so they never block submission
    this.depositInfo.DEPOSIT_BANK_NAME = '';
    this.depositInfo.DEPOSIT_BRANCH_NAME = '';
    this.depositInfo.DEPOSIT_IFSC_CODE = '';
    this.depositInfo.DEPOSIT_ACCOUNT_NUMBER = '';

    if (this.depositInfo.ACCOUNT_TYPE == 'F') {
      this.depositInfo.AUTO_RENEWAL = false;
    }

    if (this.depositInfo.ACCOUNT_TYPE == 'C') {
      this.depositInfo.RATE_OF_INTEREST = 0;
      this.depositInfo.RATE_OF_INTEREST_SAVING = 0;
    } else if (this.depositInfo.ACCOUNT_TYPE == 'A') {
      const roi = Number(this.getSavingInterestDisplay());
      this.depositInfo.RATE_OF_INTEREST = roi;
      this.depositInfo.RATE_OF_INTEREST_SAVING = roi;
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
          // Bank Details is hidden for deposit: clear these fields so old DB values do not cause issues
          this.depositInfo.DEPOSIT_BANK_NAME = '';
          this.depositInfo.DEPOSIT_BRANCH_NAME = '';
          this.depositInfo.DEPOSIT_IFSC_CODE = '';
          this.depositInfo.DEPOSIT_ACCOUNT_NUMBER = '';
          this.changeCatagory();
        } else {
        }
      },
      error: (err) => { },
      complete: () => { },
    });
  }

  getSavingInterestDisplay(): string {
    if (this.depositInfo.ACCOUNT_TYPE === 'C') {
      return '0.00';
    }
    const val = (this.depositInfo.RATE_OF_INTEREST_SAVING !== undefined && this.depositInfo.RATE_OF_INTEREST_SAVING !== null && String(this.depositInfo.RATE_OF_INTEREST_SAVING).trim() !== '')
      ? this.depositInfo.RATE_OF_INTEREST_SAVING
      : this.depositInfo.RATE_OF_INTEREST;
    return val !== undefined && val !== null && String(val).trim() !== ''
      ? Number(val).toFixed(2)
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

  onPasteNumberOnly(
    event: ClipboardEvent,
    field: 'INITIAL_AMOUNT' | 'DEPOSIT_AMOUNT' | 'TANURE_YEARS' | 'TANURE_MONTHS' | 'TANURE_DAYS'
  ): void {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;
    const pastedText = clipboardData.getData('text') || '';
    const clean = pastedText.replace(/[^0-9]/g, '');
    if (clean) {
      let val = Number(clean);
      if (field === 'TANURE_MONTHS' && val > 12) {
        val = 12;
      } else if (field === 'TANURE_DAYS') {
        if (val > 31) val = 31;
        this.depositInfo[field] = val;
        this.onDaysChange();
        return;
      }
      this.depositInfo[field] = val;
    }
  }

  onYearChange(val: any): void {
    if (val === null || val === undefined || val === '') {
      this.depositInfo.TANURE_YEARS = null as any;
      return;
    }
    const clean = String(val).replace(/[^0-9]/g, '');
    this.depositInfo.TANURE_YEARS = clean !== '' ? Number(clean) : (null as any);
  }

  onMonthChange(val: any): void {
    if (val === null || val === undefined || val === '') {
      this.depositInfo.TANURE_MONTHS = null as any;
      return;
    }
    const clean = String(val).replace(/[^0-9]/g, '');
    if (clean === '') {
      this.depositInfo.TANURE_MONTHS = null as any;
      return;
    }
    let num = Number(clean);
    if (num > 12) {
      num = 12;
    }
    this.depositInfo.TANURE_MONTHS = num;
  }

  isYearInvalid(): boolean {
    if (this.depositInfo.TANURE_YEARS == null || this.depositInfo.TANURE_YEARS === ('' as any)) {
      return false;
    }
    const val = Number(this.depositInfo.TANURE_YEARS);
    return isNaN(val) || val < 0;
  }

  isMonthInvalid(): boolean {
    if (this.depositInfo.TANURE_MONTHS == null || this.depositInfo.TANURE_MONTHS === ('' as any)) {
      return false;
    }
    const val = Number(this.depositInfo.TANURE_MONTHS);
    return isNaN(val) || val < 0 || val > 12;
  }

  isDayInvalid(): boolean {
    if (this.depositInfo.TANURE_DAYS == null || this.depositInfo.TANURE_DAYS === ('' as any)) {
      return false;
    }
    const val = Number(this.depositInfo.TANURE_DAYS);
    return isNaN(val) || val < 0 || val > 31;
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

