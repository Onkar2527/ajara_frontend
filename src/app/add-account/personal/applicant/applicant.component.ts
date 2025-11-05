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
  ) {}

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

  showAadharNo(value: string) {
    this.previewAdhaar = value;
  }

  async getOtp() {
    if ((await this.checkBalance(1)) == 0) {
      return;
    }

    if (!(await this.searchAadhaar())) {
      return;
    }

    this.loadOtpButton = true;
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
    if ((await this.checkBalance(2)) == 0) return;
    if (!(await this.searchPAN())) return;

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
    let Age = this.basicInfo[dob_key];
    if (Age) {
      let ageArray = Age.split('/');
      let year = ~~ageArray[2];
      let currentDate = new Date();
      let currentYear = currentDate.getFullYear();
      this.basicInfo[age_key] = currentYear - year;
      if (this.basicInfo[age_key] < 18 && this.applicantNo === 1) {
        this.isMinor.emit(true);
      } else if (this.basicInfo[age_key] >= 18 && this.applicantNo === 1) {
        this.isMinor.emit(false);
      }
    } else {
      this.basicInfo[age_key] = 0;
    }
  }

  async searchCustomer() {
    const customerId = this.basicInfo['CUSTOMER_ID_' + this.applicantNo];
    if (customerId) {
      let res: any = await lastValueFrom(this.api.searchCustomer(customerId));
      this.handleSearchResponse(res);
    } else {
      this.message.error('Please Enter Customer ID.', '');
    }
  }

  async searchAadhaar() {
    const aadhaarNo = this.aadhaarVerify.aadhar_history.AADHAAR_NUMBER;
    if (aadhaarNo) {
      let res: any = await lastValueFrom(
        this.api.searchCustomer('', aadhaarNo, '', 'AADHAAR_NO')
      );
      return this.handleSearchResponse(res);
    }
    return true;
  }

  async searchPAN() {
    const panNo = this.aadhaarVerify.pan_history.PAN_NUMBER;
    if (panNo) {
      let res: any = await lastValueFrom(
        this.api.searchCustomer('', '', panNo, 'PAN')
      );
      return this.handleSearchResponse(res);
    }
    return true;
  }

  private handleSearchResponse(res: any): boolean {
    if (res['code'] == 200) {
      const searchData = res['data'];
      if (searchData.ALREADY_EXIST == 'Y') {
        this.message.error(
          'This Customer Already Has An Individual Account.',
          ''
        );
        return false;
      } else {
        this.populateFieldsFromSearch(searchData);
      }
    } else if (res['code'] == 404) {
      this.message.error('No Customer Found.', '');
    } else {
      this.message.error('Something Went Wrong', '');
    }
    return true;
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

  convertDate(date: string) {
    if (!date) return '';
    let arr = date.split(' ');
    let firstPart = arr[0].split('-');
    let dd = firstPart[0],
      mm = firstPart[1],
      yy = firstPart[2];
    return `${dd}/${mm}/${yy}`;
  }
}
