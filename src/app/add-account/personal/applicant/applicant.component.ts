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

  isCustomerIdGivenByUser: boolean = false;
  userProvidedCustomerId: string = '';

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.getMasters();
    if (this.APPLICANT_ID) {
      this.getHistories();
    }
    const existingCustId = this.basicInfo['CUSTOMER_ID_' + this.applicantNo];
    if (this.basicInfo['IS_OLD_CUSTOMER_' + this.applicantNo] && existingCustId) {
      this.isCustomerIdGivenByUser = true;
      this.userProvidedCustomerId = String(existingCustId).trim();
    }
  }

  hasUserGivenCustomerId(): boolean {
    const isOld = !!this.basicInfo['IS_OLD_CUSTOMER_' + this.applicantNo];
    const currentId = this.basicInfo['CUSTOMER_ID_' + this.applicantNo];
    return (
      this.isCustomerIdGivenByUser &&
      isOld &&
      !!(currentId && String(currentId).trim().length > 0)
    );
  }

  onCustomerIdInput(value: any) {
    const trimmed = value ? String(value).trim() : '';
    if (trimmed.length > 0) {
      this.isCustomerIdGivenByUser = true;
      this.userProvidedCustomerId = trimmed;
    } else {
      this.isCustomerIdGivenByUser = false;
      this.userProvidedCustomerId = '';
    }
  }

  onOldCustomerToggle(value: boolean) {
    if (!value) {
      this.isCustomerIdGivenByUser = false;
      this.userProvidedCustomerId = '';
      this.basicInfo['CUSTOMER_ID_' + this.applicantNo] = '';
    } else {
      const currentId = this.basicInfo['CUSTOMER_ID_' + this.applicantNo];
      if (currentId && String(currentId).trim().length > 0) {
        this.isCustomerIdGivenByUser = true;
        this.userProvidedCustomerId = String(currentId).trim();
      }
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

    try {
      const canProceed = await this.searchAadhaar();
      if (!canProceed) {
        this.loadOtpButton = false;
        return;
      }
    } catch (e) {
      console.error('CBS search by Aadhaar error:', e);
    }

    if ((await this.checkBalance(1)) == 0) {
      this.loadOtpButton = false;
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

  isSearchingCustomer: boolean = false;

  async searchCustomer() {
    const customerId = this.basicInfo['CUSTOMER_ID_' + this.applicantNo];
    if (customerId) {
      this.isCustomerIdGivenByUser = true;
      this.userProvidedCustomerId = String(customerId).trim();
      this.isSearchingCustomer = true;
      try {
        let res: any = await lastValueFrom(this.api.searchCustomer(String(customerId).trim()));
        this.handleSearchResponse(res, true);
      } catch (err: any) {
        this.handleSearchError(err, true);
      } finally {
        this.isSearchingCustomer = false;
      }
    } else {
      this.message.error('Please Enter Customer ID.', '');
    }
  }

  async searchAadhaar(): Promise<boolean> {
    const aadhaarNo = this.aadhaarVerify?.aadhar_history?.AADHAAR_NUMBER;
    if (aadhaarNo) {
      try {
        const cleanAadhaar = aadhaarNo.replace(/\D/g, '');
        const searchVal = cleanAadhaar.length === 12 ? cleanAadhaar : aadhaarNo;
        let res: any = await lastValueFrom(
          this.api.searchCustomer('', searchVal, '', 'AADHAAR_NO')
        );
        return this.handleSearchResponse(res, false);
      } catch (err: any) {
        return this.handleSearchError(err, false);
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
        return this.handleSearchResponse(res, false);
      } catch (err: any) {
        return this.handleSearchError(err, false);
      }
    }
    return true;
  }

  private isNotFoundMessage(dataOrMsg: any): boolean {
    if (dataOrMsg === null || dataOrMsg === undefined) return false;
    if (typeof dataOrMsg === 'string') {
      const str = dataOrMsg.toLowerCase();
      return (
        str.includes('member details not found') ||
        str.includes('not found') ||
        str.includes('not existing') ||
        str.includes('no customer found') ||
        str.includes('record not found') ||
        str.includes('does not exist')
      );
    }
    if (typeof dataOrMsg === 'object') {
      if (Array.isArray(dataOrMsg) && dataOrMsg.length === 0) return true;
      const str = JSON.stringify(dataOrMsg).toLowerCase();
      return str.includes('member details not found') || str.includes('not found') || str.includes('record not found');
    }
    return false;
  }

  private handleSearchResponse(res: any, isExplicitSearch: boolean = false): boolean {
    if (res?.code === 200 || res?.status === 200 || res?.status === 'SUCCESS' || res?.data) {
      let searchData = res.data !== undefined ? res.data : res;

      if (typeof searchData === 'string') {
        try {
          searchData = JSON.parse(searchData);
        } catch (e) {}
      }

      if (Array.isArray(searchData)) {
        if (searchData.length > 0) {
          searchData = searchData[0];
        } else {
          searchData = null;
        }
      } else if (searchData && typeof searchData === 'object' && Array.isArray(searchData.data)) {
        if (searchData.data.length > 0) {
          searchData = searchData.data[0];
        }
      }

      if (this.isNotFoundMessage(searchData)) {
        this.basicInfo['IS_OLD_CUSTOMER_' + this.applicantNo] = false;
        if (isExplicitSearch) {
          this.message.warning('Customer details not found in CBS.', '');
          return false;
        }
        return true;
      }

      if (searchData && typeof searchData === 'object') {
        const originalCustomer = res?.original_data?.['Customer Details'] || {};
        const mergedData = Object.assign({}, originalCustomer, searchData);

        const custId = (
          mergedData.CUSTOMERID ||
          mergedData.CUSTOMER_ID ||
          mergedData.CUST_ID ||
          mergedData.customerId ||
          mergedData.CUSTID ||
          ''
        ).toString().trim();

        const firstName = mergedData.FIRST_NAME || mergedData.FIRSTNAME || mergedData.F_NAME || mergedData.FNAME || mergedData.FIRST_NAME_M || mergedData.CUST_FIRST_NAME;
        const pan = mergedData.PAN || mergedData.PAN_NO || mergedData.PAN_NUMBER;
        const aadhaar = mergedData.CUSTUIN || mergedData.AADHAAR_NO || mergedData.AADHAAR_NUMBER || mergedData.AADHAAR || mergedData.UID;
        const mobile = mergedData.MOBILE || mergedData.MOBILE_NO || mergedData.MOBILE_NUMBER || mergedData.MOBILENO;

        const isAlreadyExist =
          mergedData.ALREADY_EXIST === 'Y' ||
          mergedData.already_exist === 'Y' ||
          res?.original_data?.['Having individual account'] === 'Y' ||
          !!originalCustomer.CUSTOMERID;

        if (custId || firstName || pan || aadhaar || mobile) {
          if (isExplicitSearch) {
            this.isCustomerIdGivenByUser = true;
            this.userProvidedCustomerId = custId;
            this.message.success('Customer details fetched and auto-filled successfully.', '');
            this.populateFieldsFromSearch(mergedData);
            return true;
          }

          if (isAlreadyExist) {
            if (this.hasUserGivenCustomerId()) {
              // Case 2: Customer ID was given by user -> DO NOT block OTP
              const userCustId = (this.userProvidedCustomerId || this.basicInfo['CUSTOMER_ID_' + this.applicantNo] || '').toString().trim();
              if (custId && userCustId && custId !== userCustId) {
                this.message.error(
                  `This Aadhaar number is already linked to another Customer ID (${custId}) in CBS.`,
                  ''
                );
                return false;
              }
              this.populateFieldsFromSearch(mergedData);
              return true;
            } else {
              // Case 1: Customer ID was NOT given by user -> show customer already present and BLOCK sending OTP
              const msg = custId
                ? `Customer already exists in CBS with Customer ID: ${custId}.`
                : 'Customer already exists in CBS.';
              this.message.error(
                msg,
                'OTP sending is blocked. Please provide Customer ID to proceed.'
              );
              this.populateFieldsFromSearch(mergedData);
              this.isCustomerIdGivenByUser = false;
              this.userProvidedCustomerId = '';
              return false; // BLOCK sending OTP
            }
          }

          this.populateFieldsFromSearch(mergedData);
          return true;
        }
      }

      this.basicInfo['IS_OLD_CUSTOMER_' + this.applicantNo] = false;
      if (isExplicitSearch) {
        this.message.warning('Customer details not found in CBS.', '');
        return false;
      }
      return true;
    }

    if (
      res?.code === 404 ||
      res?.code === 400 ||
      this.isNotFoundMessage(res?.data) ||
      this.isNotFoundMessage(res?.message)
    ) {
      this.basicInfo['IS_OLD_CUSTOMER_' + this.applicantNo] = false;
      if (isExplicitSearch) {
        this.message.warning('Customer details not found in CBS.', '');
        return false;
      }
      return true;
    }

    if (isExplicitSearch) {
      this.message.error('Something Went Wrong while searching customer.', '');
      return false;
    }
    return true;
  }

  private handleSearchError(err: any, isExplicitSearch: boolean = false): boolean {
    const errData =
      err?.error?.data || err?.error?.message || err?.error || err?.message || '';
    if (
      this.isNotFoundMessage(errData) ||
      err?.status === 404 ||
      err?.status === 400
    ) {
      this.basicInfo['IS_OLD_CUSTOMER_' + this.applicantNo] = false;
      if (isExplicitSearch) {
        this.message.warning('Customer details not found in CBS.', '');
        return false;
      }
      return true;
    }

    if (isExplicitSearch) {
      this.message.error('Something Went Wrong while searching customer.', '');
      return false;
    }
    return true;
  }

  private populateFieldsFromSearch(data: any) {
    const custId = data.CUSTOMERID || data.CUSTOMER_ID || data.CUST_ID || data.customerId || data.CUSTID || this.basicInfo['CUSTOMER_ID_' + this.applicantNo];
    this.basicInfo['CUSTOMER_ID_' + this.applicantNo] = custId;
    this.basicInfo['IS_OLD_CUSTOMER_' + this.applicantNo] = true;

    // PAN Number
    const pan = (data.PAN || data.PAN_NO || data.PAN_NUMBER || data.pan_no || data.pan || '').toString().trim().toUpperCase();
    if (pan) {
      const panKey = 'PAN_NUMBER' + (this.applicantNo > 1 ? this.applicantNo : '');
      this.basicInfo[panKey] = pan;
      this.aadhaarVerify.pan_history.PAN_NUMBER = pan;
    }

    // Aadhaar Number / CUSTUIN
    const aadhaar = (data.CUSTUIN || data.AADHAAR_NO || data.AADHAAR_NUMBER || data.AADHAAR || data.UID || '').toString().trim();
    if (aadhaar) {
      this.basicInfo['AADHAAR_NO_' + this.applicantNo] = aadhaar;
      this.aadhaarVerify.aadhar_history.AADHAAR_NUMBER = aadhaar;
      this.showAadharNo(aadhaar);
    }

    // Mobile
    const mobile = (data.MOBILE || data.MOBILE_NO || data.MOBILE_NUMBER || data.MOBILENO || data.CONTACT_NO || data.PHONE || '').toString().trim();
    if (mobile) {
      this.basicInfo['MOBILE_' + this.applicantNo] = mobile;
    }

    // Gender
    let gender = (data.GENDER || data.SEX || '').toString().trim().toUpperCase();
    if (gender) {
      if (gender.startsWith('M')) gender = 'M';
      else if (gender.startsWith('F')) gender = 'F';
      else if (gender.startsWith('T')) gender = 'T';
      this.basicInfo['GENDER_' + this.applicantNo] = gender;
    }

    // Title / Salutation / Customer Type
    const title = data.TITLE || data.TITLEDESC || data.SALUTATION || data.CUSTOMER_TYPE;
    if (title) {
      this.basicInfo['CUSTOMER_TYPE_' + this.applicantNo] = title;
    }

    // First Name
    const firstName = data.FIRST_NAME || data.FIRSTNAME || data.F_NAME || data.FNAME || data.FIRST_NAME_M || data.CUST_FIRST_NAME || '';
    if (firstName) {
      this.basicInfo[
        this.applicantNo === 1
          ? 'PRIMARY_APPLICANT_FIRST_NAME'
          : 'APPLICANT' + this.applicantNo + '_FIRST_NAME'
      ] = String(firstName).trim();
    }

    // Middle Name
    const middleName = data.MIDDLE_NAME || data.MIDDLENAME || data.M_NAME || data.MNAME || data.MIDDLE_NAME_M || data.CUST_MIDDLE_NAME || '';
    if (middleName) {
      this.basicInfo[
        this.applicantNo === 1
          ? 'PRIMARY_APPLICANT_MIDDLE_NAME'
          : 'APPLICANT' + this.applicantNo + '_MIDDLE_NAME'
      ] = String(middleName).trim();
    }

    // Last Name
    const lastName = data.LAST_NAME || data.LASTNAME || data.L_NAME || data.LNAME || data.LAST_NAME_M || data.CUST_LAST_NAME || '';
    if (lastName) {
      this.basicInfo[
        this.applicantNo === 1
          ? 'PRIMARY_APPLICANT_LAST_NAME'
          : 'APPLICANT' + this.applicantNo + '_LAST_NAME'
      ] = String(lastName).trim();
    }

    // Date of Birth
    const dob = data.BIRTHDATE || data.DOB || data.DATE_OF_BIRTH || data.BIRTH_DATE || '';
    if (dob) {
      this.basicInfo['DOB_' + this.applicantNo] = this.convertDate(dob);
      this.calculateAge();
    }
  }

  convertDate(dateStr: any): string {
    if (!dateStr) return '';
    if (typeof dateStr !== 'string') {
      if (dateStr instanceof Date) {
        const day = String(dateStr.getDate()).padStart(2, '0');
        const month = String(dateStr.getMonth() + 1).padStart(2, '0');
        const year = dateStr.getFullYear();
        return `${day}/${month}/${year}`;
      }
      dateStr = String(dateStr);
    }

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
