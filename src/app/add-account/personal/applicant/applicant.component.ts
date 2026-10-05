import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, lastValueFrom } from 'rxjs';
import {
  Aadhaar,
  Aadhaar_History,
  License_History,
  Pan_History,
  Voter_History,
} from 'src/app/models/aadhaar';
import { BasicInfo } from 'src/app/models/basicInfo';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.css'],
})
export class ApplicantComponent implements OnInit {
  @Input() applicantNo!: number;
  @Input() basicInfo: BasicInfo = new BasicInfo();
  @Input() APPLICANT_ID!: number;
  @Output() isMinor = new EventEmitter<boolean>();

  aadhaarVerify: Aadhaar = new Aadhaar(this.api, this.message);
  loadAadhaarButton = false;
  loadOtpButton = false;
  loadPanButton = false;
  loadVoterButton: boolean = false;
  loadLicenseButton: boolean = false;
  previewAdhaar: string = '';

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.getMasters();
    if (this.APPLICANT_ID) {
      this.getHistories();
    }
  }

  getHistories() {
    this.getAdhaarHistory();
    this.getPanHistory();
    this.getVoterData();
    this.getLicenseData();
  }

  MASTERS = [{ id: 2, data: <any>[], name: 'title' }];

  async getMasters() {
    for (let i = 0; i < this.MASTERS.length; i++) {
      let result = await lastValueFrom(this.api.getMasters(this.MASTERS[i].id));

      if (result['code'] == 200 && result['data'].length > 0) {
        this.MASTERS[i].data = result['data'];
      }
    }
  }

  isAadhaarValid(): boolean {
    const aadhaar = this.aadhaarVerify?.aadhar_history?.AADHAAR_NUMBER;
    if (!aadhaar) return false;
    const clean = aadhaar.replace(/\D/g, '');
    return clean.length === 12;
  }

  showAadharNo(value: string) {
    this.previewAdhaar = value;
  }

  async getOtp() {
    if (!this.isAadhaarValid()) {
      this.message.error('Please enter valid 12-digit Aadhaar number.', '');
      return;
    }
    this.loadOtpButton = true;
    if ((await this.checkBalance(1)) == 0) {
      return;
    }

    if (!(await this.searchAadhaar())) {
      return;
    }

    let otpData = this.aadhaarVerify.getOTP();
    otpData.subscribe({
      next: (res) => {
        this.loadOtpButton = false;
      },
      error: () => {
        this.loadOtpButton = false;
      },
    });
  }

  getAadhaarData() {
    if (!this.aadhaarVerify.meta.otp) {
      this.message.error('Please enter OTP first', '');
      return;
    }
    this.loadAadhaarButton = true;
    let aadhar_data = this.aadhaarVerify.getData();
    aadhar_data.subscribe({
      next: (res) => {
        if (res == true) {
          this.saveAadhaarData();
          this.Hit(1);
        }
        this.loadAadhaarButton = false;
      },
      error: (err) => {
        this.loadAadhaarButton = false;
      },
    });
  }

  saveAadhaarData() {
    this.aadhaarVerify.aadhar_history.APPLICANT_ID = this.APPLICANT_ID;
    this.aadhaarVerify.aadhar_history.APPLICANT_NO = this.applicantNo;
    this.aadhaarVerify.aadhar_history.ADDRESS_ID = [
      this.aadhaarVerify.aadhar_address,
    ];
    this.basicInfo['AADHAAR_NO_' + this.applicantNo] =
      this.aadhaarVerify.aadhar_history.AADHAAR_NUMBER;
    this.saveAadhaar(this.aadhaarVerify.aadhar_history);
  }

  private saveAadhaar(data: Aadhaar_History) {
    const apiCall = data.ID
      ? this.api.updateAadhaarData(data)
      : this.api.createAadhaarData(data);
    apiCall.subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.getAdhaarHistory();
        }
      },
    });
  }

  getAdhaarHistory() {
    let aadhaar_no = this.basicInfo['AADHAAR_NO_' + this.applicantNo];
    if (!aadhaar_no) return;

    this.api.getAadhaarData(this.applicantNo, aadhaar_no).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.aadhaarVerify.aadhar_history = res['data'][0];
          if (this.aadhaarVerify.aadhar_history.ADDRESS_ID.length > 0) {
            this.aadhaarVerify.aadhar_address =
              this.aadhaarVerify.aadhar_history.ADDRESS_ID[0];
          }
          this.aadhaarVerify.MakeHistory();
        }
      },
    });
  }

  async verifyPan() {
    const rawPan = this.basicInfo[
      'PAN_NUMBER' + (this.applicantNo > 1 ? this.applicantNo : '')
    ];
    if (!rawPan || !rawPan.trim()) {
      this.message.error('Please enter a PAN Number first.', '');
      return;
    }
    const formattedPan = rawPan.trim().toUpperCase();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formattedPan)) {
      this.message.error('Invalid PAN Number format. Must be 10 characters (e.g., ABCDE1234F).', '');
      return;
    }
    this.basicInfo[
      'PAN_NUMBER' + (this.applicantNo > 1 ? this.applicantNo : '')
    ] = formattedPan;
    this.aadhaarVerify.pan_history.PAN_NUMBER = formattedPan;

    if ((await this.checkBalance(2)) == 0) return;
    // if (!(await this.searchPAN())) return;

    this.loadPanButton = true;
    let panverify = this.aadhaarVerify.verifyPan();
    panverify.subscribe({
      next: (res) => {
        if (res == true) {
          this.basicInfo[
            'PAN_NUMBER' + (this.applicantNo > 1 ? this.applicantNo : '')
          ] = this.aadhaarVerify.pan_history.PAN_NUMBER;
          this.savePanData();
          this.Hit(2);
        }
        this.loadPanButton = false;
      },
      error: () => {
        this.loadPanButton = false;
      },
    });
  }

  savePanData() {
    this.aadhaarVerify.pan_history.APPLICANT_NO = this.applicantNo;
    this.savePAN(this.aadhaarVerify.pan_history);
  }

  savePAN(PAN: Pan_History) {
    const apiCall = PAN.ID
      ? this.api.updatePanData(PAN)
      : this.api.createPanData(PAN);
    apiCall.subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.getPanHistory();
        }
      },
    });
  }

  getPanHistory() {
    let pan_no =
      this.basicInfo[
      'PAN_NUMBER' + (this.applicantNo > 1 ? this.applicantNo : '')
      ];
    if (!pan_no) return;

    this.api.getPanData(this.applicantNo, pan_no).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.aadhaarVerify.pan_history = res['data'][0];
        }
      },
    });
  }

  async verifyVoterID() {
    if ((await this.checkBalance(3)) == 0) return;

    this.loadVoterButton = true;
    let voterVerify = this.aadhaarVerify.verifyVoterID();
    voterVerify.subscribe({
      next: (res) => {
        if (res == true) {
          this.basicInfo['VOTER_ID_' + this.applicantNo] =
            this.aadhaarVerify.voter_history.EPIC_NO;
          this.saveVoterData();
          this.Hit(3);
        }
        this.loadVoterButton = false;
      },
      error: () => {
        this.loadVoterButton = false;
      },
    });
  }

  saveVoterData() {
    this.saveVoter(this.aadhaarVerify.voter_history);
  }

  saveVoter(Voter: Voter_History) {
    const apiCall = Voter.ID
      ? this.api.updateVoterHistory(Voter)
      : this.api.createVoterHistory(Voter);
    apiCall.subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.getVoterData();
        }
      },
    });
  }

  getVoterData() {
    let voter_id = this.basicInfo['VOTER_ID_' + this.applicantNo];
    if (!voter_id) return;

    this.api.getVoterHistory(voter_id).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.aadhaarVerify.voter_history = res['data'][0];
        }
      },
    });
  }

  async verifyLicense() {
    if ((await this.checkBalance(4)) == 0) return;

    this.loadLicenseButton = true;
    let licenseVerify = this.aadhaarVerify.getLicenseData();
    licenseVerify.subscribe({
      next: (res) => {
        if (res == true) {
          this.basicInfo['LICENSE_NO_' + this.applicantNo] =
            this.aadhaarVerify.license_history.LICENSE_NUMBER;
          this.saveLicenseData();
          this.Hit(4);
        }
        this.loadLicenseButton = false;
      },
      error: () => {
        this.loadLicenseButton = false;
      },
    });
  }

  saveLicenseData() {
    this.saveLicense(this.aadhaarVerify.license_history);
  }

  saveLicense(license: License_History) {
    const apiCall = license.ID
      ? this.api.updateLicenseHistory(license)
      : this.api.createLicenseHistory(license);
    apiCall.subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.getLicenseData();
        }
      },
    });
  }

  getLicenseData() {
    let license_no = this.basicInfo['LICENSE_NO_' + this.applicantNo];
    if (!license_no) return;

    this.api.getLicenseHistory(license_no).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.aadhaarVerify.license_history = res['data'][0];
        }
      },
    });
  }

  async checkBalance(doc_id: number) {
    let suffR = await lastValueFrom(this.api.checkSufBal(doc_id));
    if (suffR['code'] == 200) {
      if (!suffR['isSufficient']) {
        this.message.error('Insufficient Balance.', 'Please Recharge.');
        return 0;
      }
      return 1;
    } else {
      this.message.error('Something went wrong.', 'Failed to fetch balance.');
      return 0;
    }
  }

  Hit(doc_type: number) {
    let BRANCH_ID = Number(sessionStorage.getItem('BRANCH_ID'));
    let USER_ID = Number(sessionStorage.getItem('USER_ID'));
    lastValueFrom(this.api.docVerifyHit(BRANCH_ID, USER_ID, doc_type));
  }

  calculateAge() {
    let dob_key: any = 'DOB_' + this.applicantNo;
    let age_key: any = 'AGE_' + this.applicantNo;
    let dobVal = this.basicInfo[dob_key];

    if (dobVal && typeof dobVal === 'string') {
      const formattedDob = this.convertDate(dobVal);
      if (formattedDob !== dobVal && formattedDob.length === 10) {
        this.basicInfo[dob_key] = formattedDob;
      }

      const parts = formattedDob.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        const currentYear = new Date().getFullYear();

        if (year > 1900 && year <= currentYear && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          const today = new Date();
          let age = today.getFullYear() - year;
          const monthDiff = (today.getMonth() + 1) - month;

          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
            age--;
          }

          if (age >= 0 && age < 120) {
            this.basicInfo[age_key] = age;
            if (this.applicantNo === 1) {
              this.isMinor.emit(age < 18);
            }
            return;
          }
        }
      }
    }

    this.basicInfo[age_key] = 0;
  }

  async searchCustomer() {
    const customerId = this.basicInfo['CUSTOMER_ID_' + this.applicantNo];
    if (customerId) {
      try {
        let res: any = await lastValueFrom(this.api.searchCustomer(customerId));
        this.handleSearchResponse(res);
      } catch (err: any) {
        this.handleSearchError(err);
      }
    } else {
      this.message.error('Please Enter Customer ID.', '');
    }
  }

  async searchAadhaar() {
    const aadhaarNo = this.aadhaarVerify.aadhar_history.AADHAAR_NUMBER;
    if (aadhaarNo) {
      try {
        let res: any = await lastValueFrom(
          this.api.searchCustomer('', aadhaarNo, '', 'AADHAAR_NO')
        );
        return this.handleSearchResponse(res);
      } catch (err: any) {
        return this.handleSearchError(err);
      }
    }
    return true;
  }

  async searchPAN() {
    const panNo = this.aadhaarVerify.pan_history.PAN_NUMBER;
    if (panNo) {
      try {
        let res: any = await lastValueFrom(
          this.api.searchCustomer('', '', panNo, 'PAN')
        );
        return this.handleSearchResponse(res);
      } catch (err: any) {
        return this.handleSearchError(err);
      }
    }
    return true;
  }

  private isNotFoundMessage(dataOrMsg: any): boolean {
    if (!dataOrMsg) return true;
    if (typeof dataOrMsg === 'string') {
      const str = dataOrMsg.toLowerCase();
      return (
        str.includes('member details not found') ||
        str.includes('not found') ||
        str.includes('not existing') ||
        str.includes('no customer found')
      );
    }
    if (typeof dataOrMsg === 'object') {
      const str = JSON.stringify(dataOrMsg).toLowerCase();
      return str.includes('member details not found') || str.includes('not found');
    }
    return false;
  }

  private handleSearchResponse(res: any): boolean {
    if (res?.code === 200) {
      const searchData = res.data;

      if (this.isNotFoundMessage(searchData)) {
        this.basicInfo['IS_OLD_CUSTOMER_' + this.applicantNo] = false;
        return true;
      }

      if (searchData && typeof searchData === 'object' && searchData.CUSTOMERID) {
        if (searchData.ALREADY_EXIST === 'Y') {
          this.message.warning(
            'Customer already exists in CBS. Customer details fetched.',
            ''
          );
        }
        this.populateFieldsFromSearch(searchData);
        return true;
      }

      this.basicInfo['IS_OLD_CUSTOMER_' + this.applicantNo] = false;
      return true;
    }

    if (
      res?.code === 404 ||
      res?.code === 400 ||
      this.isNotFoundMessage(res?.data) ||
      this.isNotFoundMessage(res?.message)
    ) {
      this.basicInfo['IS_OLD_CUSTOMER_' + this.applicantNo] = false;
      return true;
    }

    this.message.error('Something Went Wrong', '');
    return false;
  }

  private handleSearchError(err: any): boolean {
    const errData =
      err?.error?.data || err?.error?.message || err?.error || err?.message || '';
    if (
      this.isNotFoundMessage(errData) ||
      err?.status === 404 ||
      err?.status === 400
    ) {
      this.basicInfo['IS_OLD_CUSTOMER_' + this.applicantNo] = false;
      return true;
    }

    this.message.error('Something Went Wrong', '');
    return false;
  }


  private populateFieldsFromSearch(data: any) {
    this.basicInfo['CUSTOMER_ID_' + this.applicantNo] = data.CUSTOMERID;
    this.basicInfo['IS_OLD_CUSTOMER_' + this.applicantNo] = true;
    this.aadhaarVerify.pan_history.PAN_NUMBER = data.PAN;
    this.aadhaarVerify.aadhar_history.AADHAAR_NUMBER = data.CUSTUIN;
    this.basicInfo['MOBILE_' + this.applicantNo] = data.MOBILE;
    this.basicInfo['GENDER_' + this.applicantNo] = data.GENDER;
    this.basicInfo[
      this.applicantNo === 1
        ? 'PRIMARY_APPLICANT_FIRST_NAME'
        : 'APPLICANT' + this.applicantNo + '_FIRST_NAME'
    ] = data.FIRST_NAME;
    this.basicInfo[
      this.applicantNo === 1
        ? 'PRIMARY_APPLICANT_MIDDLE_NAME'
        : 'APPLICANT' + this.applicantNo + '_MIDDLE_NAME'
    ] = data.MIDDLE_NAME;
    this.basicInfo[
      this.applicantNo === 1
        ? 'PRIMARY_APPLICANT_LAST_NAME'
        : 'APPLICANT' + this.applicantNo + '_LAST_NAME'
    ] = data.LAST_NAME;
    this.basicInfo['DOB_' + this.applicantNo] = this.convertDate(
      data.BIRTHDATE
    );
    this.calculateAge();
  }

  convertDate(dateStr: any): string {
    if (!dateStr) return '';
    if (typeof dateStr !== 'string') dateStr = String(dateStr);

    dateStr = dateStr.trim().split(' ')[0].split('T')[0].replace(/[-.]/g, '/');
    const parts = dateStr.split('/').filter((p: any) => p.length > 0);

    if (parts.length === 3) {
      let [p1, p2, p3] = parts;
      if (p1.length === 4) {
        const year = p1;
        const month = p2.padStart(2, '0');
        const day = p3.padStart(2, '0');
        return `${day}/${month}/${year}`;
      }
      if (p3.length >= 4) {
        const day = p1.padStart(2, '0');
        const month = p2.padStart(2, '0');
        const year = p3.slice(0, 4);
        return `${day}/${month}/${year}`;
      }
    }
    return dateStr;
  }
}
