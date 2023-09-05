import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { Aadhaar } from 'src/app/models/aadhaar';
import { BasicInfo } from 'src/app/models/basicInfo';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  constructor(private api: ApiService, private message: NzNotificationService) { }


  loadAadhaarButton = false;
  loadAadhaarButton2 = false;


  loadOtpButton = false;
  loadOtpButton2 = false;


  loadPanButton = false;
  loadPanButton2 = false;


  aadhaarVerify: Aadhaar = new Aadhaar(this.api, this.message);
  aadhaarVerify2: Aadhaar = new Aadhaar(this.api, this.message);


  @Input() basicInfo: BasicInfo = new BasicInfo();

  APPLICANT_ID?: number;

  ngOnInit(): void {
  }


  getOtp(AplicantNo: number) {

    switch (AplicantNo) {
      case 1: {
        this.loadOtpButton = true
        let otpData = this.aadhaarVerify.getOTP();
        otpData.subscribe({
          next: (res) => {
            if (res == true) {
              this.loadOtpButton = false;

            }
            else {
              this.loadOtpButton = false;

            }
          },
          error: () => {
            this.loadOtpButton = false;

          }
        });
        break;
      }

      case 2: {
        this.loadOtpButton2 = true
        let otpData = this.aadhaarVerify2.getOTP();
        otpData.subscribe({
          next: (res) => {
            if (res == true) {
              this.loadOtpButton2 = false;

            }
            else {
              this.loadOtpButton2 = false;

            }
          },
          error: () => {
            this.loadOtpButton2 = false;

          }
        });
        break;
      }

      default: {
        console.error("Inside function getOtp : AplicantNo is Invalid - ", AplicantNo);
        break;
      }
    }

  }


  getAadhaarData(AplicantNo: number) {

    switch (AplicantNo) {
      case 1: {
        this.loadAadhaarButton = true
        let aadhar_data = this.aadhaarVerify.getData();
        aadhar_data.subscribe({
          next: (res) => {
            if (res == true) {
              if (this.aadhaarVerify.data.age < 18) {
                // this.basicInfo.IS_MINOR = true;
                // this.basicInfo.MINOR_DOB = this.aadhaarVerify.data.dob;
                this.basicInfo.AADHAAR_NUMBER = this.aadhaarVerify.data.aadhaar_no;
              }
              else {
                // this.basicInfo.IS_MINOR = false;
                this.basicInfo.AADHAAR_NUMBER = this.aadhaarVerify.data.aadhaar_no;

              }
              this.loadAadhaarButton = false
            }
            else {
              this.loadAadhaarButton = false
            }
          },
          error: (err) => {
            this.loadAadhaarButton = false
          }

        });
        break;
      }

      case 2: {
        this.loadAadhaarButton2 = true
        let aadhar_data = this.aadhaarVerify2.getData();
        aadhar_data.subscribe({
          next: (res) => {
            if (res == true) {
              this.basicInfo.AADHAAR_NUMBER2 = this.aadhaarVerify2.data.aadhaar_no;
              this.loadAadhaarButton2 = false
            }
            else {
              this.loadAadhaarButton2 = false
            }
          },
          error: (err) => {
            this.loadAadhaarButton2 = false
          }

        });

        break;
      }

      default: {
        console.error("Inside function getAadhaarData : AplicantNo is Invalid - ", AplicantNo);
        break;
      }
    }
  }

  verifyPan(AplicantNo: number) {

    switch (AplicantNo) {
      case 1: {
        this.loadPanButton = true
        let panverify = this.aadhaarVerify.verifyPan();
        panverify.subscribe({
          next: (res) => {
            if (res == true) {
              this.basicInfo.PAN_NUMBER = this.aadhaarVerify.meta1.id_number;
              this.loadPanButton = false
            }
            else {
              this.loadPanButton = false
            }
          },
          error: () => {
            this.loadPanButton = false
          }
        });
        break;
      }

      case 2: {
        this.loadPanButton2 = true;
        let panverify = this.aadhaarVerify2.verifyPan();
        panverify.subscribe({
          next: (res) => {
            if (res == true) {
              this.basicInfo.PAN_NUMBER2 = this.aadhaarVerify2.meta1.id_number;
              this.loadPanButton2 = false;
            }
            else {
              this.loadPanButton2 = false;
            }
          },
          error: () => {
            this.loadPanButton2 = false;
          }
        });
        break;
      }

      default: {
        console.error("Inside function verifyPan : AplicantNo is Invalid - ", AplicantNo);
        break;
      }
    }


  }

  save(status: string) {
    let personal: Subject<any> = new Subject();
    
    this.basicInfo.STATUS = status;

    if (this.basicInfo.ID) {
      this.api.updateBasic(this.basicInfo).subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success("Personal Information updated successfully!", '');
            this.getBasicInfo();
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
      this.api.addBasic(this.basicInfo).subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success("Personal Information added successfully!", '');
            this.APPLICANT_ID = res['APPLICANT_ID'];
            this.getBasicInfo();
            personal.next(res);
          }
          else {
            this.message.error('Failed to add personal info', '');
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
    return personal;
  }

  getBasicInfo() {
    this.api.getBasic(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.basicInfo = res['data'][0];
        }
        else {
        }
      },
      error: (err) => {
      },
      complete: () => {
      }
    });

  }


}
