import { ApiService } from "../service/api.service";
import { PanMeta } from "./pan-meta";
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { Subject } from "rxjs";

export class Aadhaar_History {
  ID?: number;
  AADHAAR_NUMBER: string = '';
  ADDRESS_ID: any;
  DOB: string = '';
  APPLICANT_FULL_NAME: string = '';
  GENDER: string = '';
  PROFILE_IMAGE: string = '';
  APPLICANT_ID?: number;
  APPLICANT_NO?: number;
  IS_VERIFIED: boolean = false;
}

export class Aadhaar_Address_History {
  ID?: number;
  COUNTRY: string = '';
  STATE: string = '';
  DISTRICT: string = '';
  SUB_DISTRICT: string = '';
  VTC: string = '';
  STREET: string = '';
  LOC: string = '';
  PO: string = '';
  LANDMARK: string = '';
  HOUSE: string = '';
  ZIPCODE: string = '';
}

export class Pan_History {
  ID!: number;
  APPLICANT_FULL_NAME: string = '';
  APPLICANT_NO!: number;
  APPLICANT_ID!: number;
  PAN_NUMBER: string = '';
  IS_VERIFIED: boolean = false;
  CATEGORY: string = '';
}

class Aadhaar_Data {
  dob: string = '';
  full_name: string = '';
  gender: string = '';
  address: AadhaarAddress = new AadhaarAddress();
  profile_image: string = '';
  age!: number;
  aadhaar_no: string = '';
}

class AadhaarAddress {
  dist: string = '';
  house: string = '';
  country: string = '';
  subdist: string = '';
  vtc: string = '';
  po: string = '';
  state: string = '';
  street: string = '';
  loc: string = '';
}

export class AadhaarMeta {
  id_number: string = '';
  client_id: string = '';
  otp_sent?: boolean;
  if_number?: boolean;
  otp: string = '';
}

export class CommonData {
  aadhaar_no: string = '';
  address: string = '';
  age !: number;
  dob: string = '';
  full_name: string = '';
  gender: string = ' ';
  profile_image: string = '';
}

export class Voter_History {
  // "relation_type": "F",
  //   "gender": "M",
  //   "age": "29",
  //   "epic_no": "NLN2089555",
  //   "client_id": "bkpkzGyssQ",
  //   "dob": "1990-08-31",
  //   "relation_name": "KALEEN BHAIYA",
  //   "name": "MUNNA BHAIYA",
  //   "area": "Mirzapur",
  //   "state": "Uttar Pradesh",
  //   "house_no": "Tripathi Haveli"

  ID?: number;
  CLIENT_ID: string = '';
  EPIC_NO: string = '';
  NAME: string = '';
  RELATION_TYPE: string = '';
  RELATION_NAME: string = '';
  GENDER: string = '';
  DOB: string = '';
  AGE?: number;
  HOUSE_NO: string = '';
  AREA: string = '';
  STATE: string = '';
  IS_VERIFIED: boolean = false;
}

export class License_History {
  // "client_id": "license_xlutVlByrhrvycjWGupg",
  // "license_number": "DL-1020151234509",
  // "state": "DL",
  // "name": "JOHNY SINGH",
  // "permanent_address": "VPO JOHN KLN DISTT DELHI",
  // "permanent_zip": "110088",
  // "temporary_address": "VPO JOHN KLN DISTT DELHI",
  // "temporary_zip": "110088",
  // "citizenship": "IND",
  // "ola_name": "RTA,DELHI",
  // "ola_code": "DL07",
  // "gender": "M",
  // "father_or_husband_name": "JOHN SINGH",
  // "dob": "1979-05-01",
  // "doe": "2029-04-30",
  // "transport_doe": "1900-01-01",
  // "doi": "2015-06-25",
  // "transport_doi": "1900-01-01",
  // "profile_image": "",
  // "has_image": true,
  // "blood_group": "A+",
  // "vehicle_classes": [
  //   "LMV   ",
  //   "MCWG  "
  // ],
  // "less_info": false,
  // "additional_check": [],
  // "initial_doi": "2015-06-25"

  ID?: number;
  CLIENT_ID: string = '';
  LICENSE_NUMBER: string = '';
  NAME: string = '';
  FATHER_OR_HUSBAND_NAME: string = '';
  GENDER: string = '';
  CITIZENSHIP: string = '';
  DOB: string = '';
  BLOOD_GROUP: string = '';

  PROFILE_IMAGE: string = '';
  PERMANENT_ADDRESS: string = '';
  PERMANENT_ZIP: string = '';
  TEMPORARY_ADDRESS: string = '';
  TEMPORARY_ZIP: string = '';
  STATE: string = '';

  OLA_NAME: string = '';
  OLA_CODE: string = '';

  INITIAL_DOI: string = '';
  DOI: string = '';
  DOE: string = '';
  TRANSPORT_DOI: string = '';
  TRANSPORT_DOE: string = '';

  VEHICLE_CLASSES: string = '';

  IS_VERIFIED: boolean = false;

}

export class Aadhaar {
  subject = new Subject();
  otpSubject = new Subject();
  constructor(private api: ApiService, private message: NzNotificationService) { }
  isok = false
  showOtp = false;

  showAadhaar: boolean = false;
  showPan: boolean = false;
  showDrivingLicense: boolean = false
  showVoterId: boolean = false
  showPassport: boolean = false

  meta: AadhaarMeta = new AadhaarMeta();
  data: Aadhaar_Data = new Aadhaar_Data();
  meta1: PanMeta = new PanMeta();
  common: CommonData = new CommonData();

  aadhar_history: Aadhaar_History = new Aadhaar_History();
  aadhar_address: Aadhaar_Address_History = new Aadhaar_Address_History();
  pan_history: Pan_History = new Pan_History();

  voter_history: Voter_History = new Voter_History();

  license_history: License_History = new License_History();

  getOTP() {
    this.meta.id_number = this.aadhar_history.AADHAAR_NUMBER;
    this.api.Aadhaar_GetOTP(this.meta)
      .subscribe({
        next: (res) => {
          if (res['code'] == 200 || res['code'] == "200") {
            const RequestedData = res['data'] ? (res['data']['result'] || res['data']) : {};
            this.meta.client_id = RequestedData["client_id"] || RequestedData["request_id"] || res['data']?.["client_id"] || res['data']?.["request_id"] || '';
            this.meta.otp_sent = true;
            this.message.success('OTP sent!', 'The unique otp has been sent to user\'s registered mobile number');
            this.showOtp = true;
            this.otpSubject.next(true);
          }
          else {
            this.message.error('Network Error❗', res['message'] || 'Please try again after sometimes');
            this.showOtp = false;
            this.otpSubject.next(res);
          }
        },
        error: (err) => {
          this.OVD_ERROR(err?.error?.message || err?.message || 'Failed to send OTP');
          this.showOtp = false;
          this.otpSubject.error(err);
        }
      });

    return this.otpSubject;
  }

  getData() {
    this.subject = new Subject();
    if (!this.meta.otp) {
      this.message.error('Please enter OTP first', '');
      setTimeout(() => this.subject.next(false), 0);
      return this.subject;
    }
    if (!this.meta.client_id) {
      this.message.error('Session Expired or Client ID missing', 'Please click Get OTP again.');
      setTimeout(() => this.subject.next(false), 0);
      return this.subject;
    }

    this.api.Aadhaar_GetData(this.meta)
      .subscribe({
        next: (res) => {
          if (res['code'] == "200" || res['code'] == 200) {
            const resData = res['data'] || {};
            this.aadhar_history.DOB = resData['dob'] || '';
            this.aadhar_history.APPLICANT_FULL_NAME = resData['full_name'] || '';
            this.aadhar_history.GENDER = this.getGender(resData['gender']);
            if (resData['profile_image']) {
              this.aadhar_history.PROFILE_IMAGE = this.formatBase64Image(resData['profile_image']);
            }

            this.aadhar_history.IS_VERIFIED = true;

            if (resData['address']) {
              this.aadhar_address.DISTRICT = resData['address']['dist'] || '';
              this.aadhar_address.HOUSE = resData['address']['house'] || '';
              this.aadhar_address.COUNTRY = resData['address']['country'] || '';
              this.aadhar_address.SUB_DISTRICT = resData['address']['subdist'] || '';
              this.aadhar_address.VTC = resData['address']['vtc'] || '';
              this.aadhar_address.PO = resData['address']['po'] || '';
              this.aadhar_address.STATE = resData['address']['state'] || '';
              this.aadhar_address.STREET = resData['address']['street'] || '';
              this.aadhar_address.LOC = resData['address']['loc'] || '';
            }

            this.message.success('Information fetched successfully', '');
            this.subject.next(true);
          }
          else {
            this.showAadhaar = false;
            const errMsg = res['data']?.['error'] || res['message'] || 'Verification Failed';
            this.message.error('Failed', errMsg);
            this.subject.next(res);
          }
        },
        error: (err) => {
          this.showAadhaar = false;
          this.subject.error(err);
          this.OVD_ERROR(err?.error?.data?.error || err?.error?.message || err?.message || 'Verification Failed');
        }
      });
    return this.subject;
  }

  MakeHistory() {
    this.showAadhaar = true;
    this.common.aadhaar_no = this.aadhar_history.AADHAAR_NUMBER;
    this.common.full_name = this.aadhar_history.APPLICANT_FULL_NAME;
    this.common.age = this.FindAge(this.aadhar_history.DOB);
    this.common.dob = this.aadhar_history.DOB;
    this.common.profile_image = this.formatBase64Image(this.aadhar_history.PROFILE_IMAGE);
    this.common.gender = this.aadhar_history.GENDER;
    this.common.address = `${this.aadhar_address.VTC}, ${this.aadhar_address.STREET}, ${this.aadhar_address.LOC}, ${this.aadhar_address.DISTRICT}
      , ${this.aadhar_address.STATE}, ${this.aadhar_address.COUNTRY}`

  }

  verifyPan() {
    let panverify = new Subject();
    this.meta1.id_number = this.pan_history.PAN_NUMBER;
    this.api.Pan_Verify(this.meta1)
      .subscribe({
        next: (res) => {
          if (res['status_code'] == 200) {
            this.meta1.full_name = res['data']['full_name'];
            this.pan_history.APPLICANT_FULL_NAME = res['data']['full_name'];
            this.pan_history.IS_VERIFIED = true;
            this.pan_history.PAN_NUMBER = res['data']['pan_number'];
            this.pan_history.CATEGORY = res['data']['category'];
            // console.log(res['data']);category
            // console.log(this.meta1.full_name);
            this.isok = true;
            this.showPan = true;
            panverify.next(true);
            this.message.success('PAN Verified', `Name on PAN : ${this.meta1.full_name}`);
          }
          else {
            this.showPan = false;
            this.message.error('PAN Verification Failed', 'Entered Pan Number is not Valid');
            panverify.next(res);
          }
        },
        error: (err) => {
          this.showPan = false;
          console.log("PAN Error", err)
          // this.message.error('PAN Verification Failed', 'Please try again after sometimes');
          this.OVD_ERROR(err.error.message);
          panverify.error(err);
        }
      });
    return panverify;
  }

  verifyVoterID() {
    let voter = new Subject();

    this.api.getVoterIDData(this.voter_history.EPIC_NO).subscribe({
      next: (res) => {
        if (res['status_code'] == 200) {
          this.voter_history.CLIENT_ID = res.data["client_id"];
          this.voter_history.EPIC_NO = res.data["epic_no"];
          this.voter_history.NAME = res.data["name"];
          this.voter_history.RELATION_TYPE = res.data["relation_type"];
          this.voter_history.RELATION_NAME = res.data["relation_name"];
          this.voter_history.GENDER = this.getGender(res.data["gender"]);
          this.voter_history.DOB = res.data["dob"];
          this.voter_history.AGE = Number(res.data["age"]);
          this.voter_history.HOUSE_NO = res.data["house_no"];
          this.voter_history.AREA = res.data["area"];
          this.voter_history.STATE = res.data["state"];

          this.voter_history.IS_VERIFIED = true;
          voter.next(true);
          this.message.success("Voter ID Verified", `Name on Voter ID : ${this.voter_history.NAME}`)
        }
        else {
          this.voter_history.IS_VERIFIED = false;
          this.message.error('Voter ID Verification Failed', 'Entered Voter ID is not Valid');
          voter.next(res);
        }
      },
      error: (err) => {
        this.voter_history.IS_VERIFIED = false;
        // this.message.error('Voter ID Verification Failed', 'Please try again after sometimes');
        this.OVD_ERROR(err.error.message);
        voter.error(err);
      }
    });
    return voter;
  }

  getLicenseData() {
    let license = new Subject();

    this.api.getLicenseData(this.license_history.LICENSE_NUMBER, this.license_history.DOB).subscribe({
      next: (res) => {
        if (res['status_code'] == 200) {

          this.license_history.CLIENT_ID = res.data["client_id"];
          this.license_history.LICENSE_NUMBER = res.data["license_number"];
          this.license_history.NAME = res.data["name"];
          this.license_history.FATHER_OR_HUSBAND_NAME = res.data["father_or_husband_name"];
          this.license_history.GENDER = this.getGender(res.data["gender"]);
          this.license_history.CITIZENSHIP = res.data["citizenship"];
          this.license_history.DOB = res.data["dob"];
          this.license_history.BLOOD_GROUP = res.data["blood_group"];
          this.license_history.PROFILE_IMAGE = res.data["profile_image"];
          this.license_history.PERMANENT_ADDRESS = res.data["permanent_address"];
          this.license_history.PERMANENT_ZIP = res.data["permanent_zip"];
          this.license_history.TEMPORARY_ADDRESS = res.data["temporary_address"];
          this.license_history.TEMPORARY_ZIP = res.data["temporary_zip"];
          this.license_history.STATE = res.data["state"];
          this.license_history.OLA_NAME = res.data["ola_name"];
          this.license_history.OLA_CODE = res.data["ola_code"];
          this.license_history.INITIAL_DOI = res.data["initial_doi"];
          this.license_history.DOI = res.data["doi"];
          this.license_history.DOE = res.data["doe"];
          this.license_history.TRANSPORT_DOI = res.data["transport_doi"];
          this.license_history.TRANSPORT_DOE = res.data["transport_doe"];
          this.license_history.VEHICLE_CLASSES = res.data["vehicle_classes"] ? JSON.stringify(res.data["vehicle_classes"]) : '[]';

          this.license_history.IS_VERIFIED = true;
          license.next(true);
          this.message.success("License Verified", `Name on License : ${this.license_history.NAME}`)
        }
        else {
          this.license_history.IS_VERIFIED = false;
          this.message.error('License Verification Failed', 'Please try again after sometimes');
          license.next(res)
        }
      },
      error: (err) => {
        this.license_history.IS_VERIFIED = false;
        console.log("license error", err)
        // this.message.error('License Verification Failed', 'Please try again after sometimes');
        this.OVD_ERROR(err.error.message);
        license.error(err);
      }
    });
    return license;
  }

  private getGender(genderCode: string): string {
    if (genderCode == 'M') {
      return 'Male';
    }
    else if (genderCode == 'F') {
      return 'Female'
    }
    else {
      return 'Other'
    }
  }

  private FindAge(Age: string): number {
    if (!Age) return 0;
    const formatted = this.formatDate(Age);
    const parts = formatted.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      const currentYear = new Date().getFullYear();
      if (year > 1900 && year <= currentYear && month >= 1 && month <= 12) {
        const today = new Date();
        let age = today.getFullYear() - year;
        const mDiff = (today.getMonth() + 1) - month;
        if (mDiff < 0 || (mDiff === 0 && today.getDate() < day)) {
          age--;
        }
        return age >= 0 ? age : 0;
      }
    }
    return 0;
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return '';
    dateStr = dateStr.trim().split(' ')[0].split('T')[0].replace(/[-.]/g, '/');
    const parts = dateStr.split('/').filter(p => p.length > 0);
    if (parts.length === 3) {
      let [p1, p2, p3] = parts;
      if (p1.length === 4) {
        return `${p3.padStart(2, '0')}/${p2.padStart(2, '0')}/${p1}`;
      }
      if (p3.length >= 4) {
        return `${p1.padStart(2, '0')}/${p2.padStart(2, '0')}/${p3.slice(0, 4)}`;
      }
    }
    return dateStr;
  }

  private SplitAadhaarNo(no: string): string {
    if (no != undefined || no != '') {
      return `${no.charAt(0)}${no.charAt(1)}${no.charAt(2)}${no.charAt(3)} ${no.charAt(4)}${no.charAt(5)}${no.charAt(6)}${no.charAt(7)} ${no.charAt(8)}${no.charAt(9)}${no.charAt(10)}${no.charAt(11)}`
    }
    else {
      console.error('no is undefined or empty in (func : SplitAadhaarNo, class : Aadhaar, comp : adharkyc)');
      return '';
    }

  }

  public formatBase64Image(img: string): string {
    if (!img) return '';
    let str = img.trim();

    while (str.indexOf('data:image') !== str.lastIndexOf('data:image')) {
      const secondIndex = str.indexOf('data:image', str.indexOf('data:image') + 1);
      str = str.substring(secondIndex);
    }

    if (!str.startsWith('data:image')) {
      str = 'data:image/png;base64,' + str;
    }

    return str;
  }

  private OVD_ERROR(message: string) {
    this.message.error(message, '');
  }

}
