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
  loadVerificationButton :boolean = false;

  OTP:string = '';
  
  ngOnInit(): void {
  }

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
  getApplicantPersonal(){
   
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
    return personal;
  }

  showOtpField:boolean = false;

  getOtp() {
    this.api.getEmailOtp(this.personalInfo.EMAIL_ID).subscribe({
      next:(res)=>{
        if(res['code'] == 200){
          this.message.success("OTP has been sent.",'Please check your inbox');
          this.showOtpField = true;
        }
        else{
          this.message.error("Something Went Wrong!","");
        }
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  verifyEmail(){
    this.api.verifyEmail(this.OTP,this.personalInfo.EMAIL_ID).subscribe({
      next:(res)=>{
        if(res['code'] == 200){
          this.message.success("Email Verified Successfully!","");
          this.showOtpField = false;
          this.personalInfo.IS_EMAIL_VERIFIED = true;
          this.OTP = '';
        }
        else{
          this.message.error("Something Went Wrong!","");
        }
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

}
