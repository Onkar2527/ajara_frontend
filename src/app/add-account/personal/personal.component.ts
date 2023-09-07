import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { Aadhaar, Aadhaar_History } from 'src/app/models/aadhaar';
import { BasicInfo } from 'src/app/models/basicInfo';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  maskedAadharNumber: string = '';

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

  @Input() APPLICANT_ID!: number;

  ngOnInit(): void {
    this.getBasicInfo()
  }

  saveAadhaarData(applicant_no:number) {
    if (applicant_no == 1) {
      this.aadhaarVerify.aadhar_history.APPLICANT_ID = this.APPLICANT_ID;
      this.aadhaarVerify.aadhar_history.APPLICANT_NO = 1;
      this.aadhaarVerify.aadhar_history.ADDRESS_ID = [this.aadhaarVerify.aadhar_address]
      this.basicInfo.AADHAAR_NO_1 = this.aadhaarVerify.aadhar_history.AADHAAR_NUMBER;
      this.saveAadhaar(this.aadhaarVerify.aadhar_history);
    }
    if (applicant_no == 2) {
      this.aadhaarVerify2.aadhar_history.APPLICANT_ID = this.APPLICANT_ID;
      this.aadhaarVerify2.aadhar_history.APPLICANT_NO = 2;
      this.aadhaarVerify2.aadhar_history.ADDRESS_ID = [this.aadhaarVerify2.aadhar_address];
      this.basicInfo.AADHAAR_NO_2 = this.aadhaarVerify2.aadhar_history.AADHAAR_NUMBER;
      this.saveAadhaar(this.aadhaarVerify2.aadhar_history);
    }

  }


  private saveAadhaar(data: Aadhaar_History) {
    if (data.ID) {

    }
    else {
      this.api.createAadhaarData(data).subscribe({
        next: (res) => {
          if (res['code'] == 200) {
            if(data.APPLICANT_NO == 1){
              this.getAdhaarHistory(1);
            }
            if(data.APPLICANT_NO == 2){
              this.getAdhaarHistory(2);
            }
          }
          else {

          }
        },
        error: (err) => {

        }
      })
    }
  }

  getAdhaarHistory(applicant_no: number) {
    let aadhaar_no = '';

    if(applicant_no == 1){
      aadhaar_no = this.basicInfo.AADHAAR_NO_1;
    }

    else if(applicant_no ==2){
      aadhaar_no = this.basicInfo.AADHAAR_NO_2;
    }

    this.api.getAadhaarData(applicant_no, aadhaar_no).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          if (applicant_no == 1) {
            this.aadhaarVerify.aadhar_history = res['data'][0];
            if (this.aadhaarVerify.aadhar_history.ADDRESS_ID.length > 0) {
              this.aadhaarVerify.aadhar_address = this.aadhaarVerify.aadhar_history.ADDRESS_ID[0];
            }
            this.hideAadhar = true;
            this.aadhaarVerify.MakeHistory();
          }
          else if (applicant_no == 2) {
            this.aadhaarVerify2.aadhar_history = res['data'][0];
            if (this.aadhaarVerify2.aadhar_history.ADDRESS_ID.length > 0) {
              this.aadhaarVerify2.aadhar_address = this.aadhaarVerify2.aadhar_history.ADDRESS_ID[0];
            }
            this.hideAadhar = true;
            this.aadhaarVerify2.MakeHistory();
          }
        }
      }
    })
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
              this.saveAadhaarData(1);
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
              this.saveAadhaarData(2);
              // this.basicInfo.AADHAAR_NUMBER2 = this.aadhaarVerify2.data.aadhaar_no;
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


  changeDate(date: any) {
    if (date) {
      let month = String(date.getMonth() + 1);
      let day = String(date.getDate());
      const year = String(date.getFullYear());

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return `${day}/${month}/${year}`;
    }
    return '';
  }


  hideAadhar = false;

  getHiddenAadhar(aadhaar:string): string {
    if (this.hideAadhar && aadhaar) {
      return aadhaar.substring(0, 8).replace(/./g, 'X') + aadhaar.substring(8);
    } else {
      return aadhaar;
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
          this.getAdhaarHistory(1);
          if (this.basicInfo.NO_OF_APPLICANT == 2) {
            this.getAdhaarHistory(2);
          }
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
