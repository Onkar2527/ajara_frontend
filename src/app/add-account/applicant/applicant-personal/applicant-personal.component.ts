import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { PersonalInfo } from 'src/app/models/personal-info';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-applicant-personal',
  templateUrl: './applicant-personal.component.html',
  styleUrls: ['./applicant-personal.component.css']
})
export class ApplicantPersonalComponent implements OnInit {
  @Input() personalInfo!: PersonalInfo;
  constructor(private api: ApiService, private message: NzNotificationService) { }

  loadOtpButton: boolean = false;
  loadVerificationButton: boolean = false;

  OTP: string = '';

  ngOnInit(): void {
  }


  mendetory_all = [
    { field: 'RISK_CATEGORY', message: "Risk Category" },
    { field: 'BLOOD_TYPE', message: 'Blood Type' },

    { field: 'FIRST_NAME', message: "Applicant First Name" },
    { field: 'MIDDLE_NAME', message: "Applicant Middle Name" },
    { field: 'LAST_NAME', message: "Applicant Last Name" },

    { field: 'F_OR_H_FIRST_NAME', message: "Father / Husband First Name" },
    { field: 'F_OR_H_MIDDLE_NAME', message: "Father / Husband Middle Name" },
    { field: 'F_OR_H_LAST_NAME', message: "Father / Husband Last Name" },

    { field: 'MOTHERS_NAME', message: "Mother's First Name" },
    { field: 'MOTHERS_MIDDLE_NAME', message: "Mother's Middle Name" },
    { field: 'MOTHERS_LAST_NAME', message: "Mother's Last Name" },

    { field: 'DATE_OF_BIRTH', message: "Date of Birth" },

    { field: 'NATIONALITY', message: "Nationality" },

    { field: 'GENDER', message: "Gender" },

    { field: 'PERMANENT_ADDRESS', message: "Permanent Address Flat No, Name of Building" },
    { field: 'PERMANENT_CITY', message: "Permanent Address City / Village" },
    { field: 'PERMANENT_TALUKA', message: "Permanent Address Taluka" },
    { field: 'PERMANENT_DISTRICT', message: "Permanent Address District" },
    { field: 'PERMANENT_LANDMARK', message: "Permanent Address Road, Area Name" },
    { field: 'PERMANENT_STATE', message: "Permanent Address State" },
    { field: 'PERMANENT_PINCODE', message: "Permanent Address Pincode" },

    { field: 'CURRENT_ADDRESS', message: "Current Address Flat No, Name of Building" },
    { field: 'CURRENT_CITY', message: "Current Address City / Village" },
    { field: 'CURRENT_TALUKA', message: "Current Address Taluka" },
    { field: 'CURRENT_DISTRICT', message: "Current Address District" },
    { field: 'CURRENT_LANDMARK', message: "Current Address Road, Area Name" },
    { field: 'CURRENT_STATE', message: "Current Address State" },
    { field: 'CURRENT_PINCODE', message: "Current Address Pincode" },

    { field: 'MOBILE_NUMBER', message: "Mobile Number 1" },

    { field: 'EMAIL_ID', message: "Email ID" },

    { field: 'RELIGION', message: "Religion" },

    { field: 'CASTE', message: "Caste" }
  ]

  mendetory_religion = [
    { field: 'OTHER_RELIGION', message: "Other Religion" }
  ]

  mendentory_cast = [
    { field: 'OTHER_CASTE', message: "Other Caste" }
  ]

  mendentory_minor = [
    { field: 'GUARDIAN_NAME', message: "Name of the Guardian" },
    { field: 'GUARDIAN_RELATION', message: "Relationship with minor" },
    { field: 'GUARDIAN_PAN', message: "Guardian's PAN number" }
  ]

  optionList = [
    {
      label: 'Indian',
      value: 'Indian'
    }
  ]

  addressList = [
    {
      label: '',
      value: ''
    }
  ]

  relationList = [
    {
      label: 'Father',
      value: 'A',
    },
    {
      label: 'Mother',
      value: 'B',
    },
    {
      label: 'Brother',
      value: 'C',
    },
    {
      label: 'Sister',
      value: 'D',
    },
    {
      label: 'Son',
      value: 'E',
    },
    {
      label: 'Daughter',
      value: 'F',
    },
    {
      label: 'Husband',
      value: 'G',
    },

    {
      label: 'Wife',
      value: 'H',
    }
  ]
  getApplicantPersonal() {

  }

  copyClick() {
    this.personalInfo.CURRENT_ADDRESS = this.personalInfo.PERMANENT_ADDRESS;
    this.personalInfo.CURRENT_CITY = this.personalInfo.PERMANENT_CITY;
    this.personalInfo.CURRENT_TALUKA = this.personalInfo.PERMANENT_TALUKA;
    this.personalInfo.CURRENT_DISTRICT = this.personalInfo.PERMANENT_DISTRICT;
    this.personalInfo.CURRENT_LANDMARK = this.personalInfo.PERMANENT_LANDMARK;
    this.personalInfo.CURRENT_STATE = this.personalInfo.PERMANENT_STATE;
    this.personalInfo.CURRENT_PINCODE = this.personalInfo.PERMANENT_PINCODE;

  }

  save() {
    let personal: Subject<any> = new Subject();

    let isOk = true;

    for (let field of this.mendetory_all) {
      if (!this.personalInfo[field.field as keyof PersonalInfo]) {
        this.message.error(`${field.message} is Mandetory`, '');
        isOk = false;
      }
    }

    if (this.personalInfo.RELIGION == 'G') {
      for (let field of this.mendetory_religion) {
        if (!this.personalInfo[field.field as keyof PersonalInfo]) {
          this.message.error(`${field.message} is Mandetory`, '');
          isOk = false;
        }
      }
    }

    if (this.personalInfo.CASTE == 'G') {
      for (let field of this.mendentory_cast) {
        if (!this.personalInfo[field.field as keyof PersonalInfo]) {
          this.message.error(`${field.message} is Mandetory`, '');
          isOk = false;
        }
      }
    }

    if (this.personalInfo.IS_MINOR) {
      for (let field of this.mendentory_minor) {
        if (!this.personalInfo[field.field as keyof PersonalInfo]) {
          this.message.error(`${field.message} is Mandetory`, '');
          isOk = false;
        }
      }
    }

    if (isOk) {
      if (this.personalInfo.ID) {
        this.api.updateAplicant(this.personalInfo).subscribe({
          next: (res) => {
            if (res.code == 200) {
              this.message.success("Personal Information updated successfully!", '');
              this.getApplicantPersonal();
              personal.next(res);
            }
            else {
              this.message.error('Failed to update personal info', '');
              personal.next(res);
            }
          },
          error: (err) => {
            this.message.error("Internal Server Error!", err);
            personal.error('err')
          },
          complete: () => {
            console.info("Add Personal Info Request Completed!");
            personal.complete();
          }
        })
      }
      else {

      }
    }
    else {
      personal.error("All mendetory fields are not filled");
    }

    return personal;
  }

  showOtpField: boolean = false;

  getOtp() {
    this.api.getEmailOtp(this.personalInfo.EMAIL_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.message.success("OTP has been sent.", 'Please check your inbox');
          this.showOtpField = true;
        }
        else {
          this.message.error("Something Went Wrong!", "");
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  verifyEmail() {
    this.api.verifyEmail(this.OTP, this.personalInfo.EMAIL_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.message.success("Email Verified Successfully!", "");
          this.showOtpField = false;
          this.personalInfo.IS_EMAIL_VERIFIED = true;
          this.OTP = '';
        }
        else {
          this.message.error("Something Went Wrong!", "");
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

}
