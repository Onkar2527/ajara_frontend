import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, first, lastValueFrom } from 'rxjs';
import { Aadhaar, Aadhaar_History, License_History, Pan_History, Voter_History } from 'src/app/models/aadhaar';
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


  mendetory_all = [
    { field: 'PRIMARY_APPLICANT_FIRST_NAME', message: 'Applicant 1 First Name' },
    { field: 'PRIMARY_APPLICANT_MIDDLE_NAME', message: 'Applicant 1 Middle Name' },
    { field: 'PRIMARY_APPLICANT_LAST_NAME', message: 'Applicant 1 Last Name' },
    { field: 'CUSTOMER_TYPE_1', message: 'Applicant 1 Customer Type' },

    { field: 'DOB_1', message: 'Applicant 1 Date Of Birth' },
    { field: 'MOBILE_1', message: 'Applicant 1 Mobile Number' },
    { field: 'PAN_NUMBER', message: 'Applicant 1 PAN Number' },
    { field: 'DOCUMENTS_AUTHORITY', message: 'Issued Document Authority' },
    { field: 'DOCUMENTS_ISSUE_PLACE', message: 'Place of issue' }
  ]

  mendetory_customer = [
    { field: 'CUSTOMER_ID_1', message: 'Applicant 1 Customer ID' }
  ]

  mendetory_applicant_2 = [
    { field: 'APPLICANT2_FIRST_NAME', message: 'Applicant 2 First Name' },
    { field: 'APPLICANT2_MIDDLE_NAME', message: 'Applicant 2 Middle Name' },
    { field: 'APPLICANT2_LAST_NAME', message: 'Applicant 2 Last Name' },
    { field: 'CUSTOMER_TYPE_2', message: 'Applicant 2 Customer Type' },
    { field: 'DOB_2', message: 'Applicant 2 Date Of Birth' },
    { field: 'MOBILE_2', message: 'Applicant 2 Mobile Number' }
  ]




  loadAadhaarButton = false;
  loadAadhaarButton2 = false;
  loadAadhaarButton3 = false;
  loadAadhaarButton4 = false;

  loadOtpButton = false;
  loadOtpButton2 = false;
  loadOtpButton3 = false;
  loadOtpButton4 = false;


  loadPanButton = false;
  loadPanButton2 = false;
  loadPanButton3 = false;
  loadPanButton4 = false;


  aadhaarVerify: Aadhaar = new Aadhaar(this.api, this.message);
  aadhaarVerify2: Aadhaar = new Aadhaar(this.api, this.message);
  aadhaarVerify3: Aadhaar = new Aadhaar(this.api, this.message);
  aadhaarVerify4: Aadhaar = new Aadhaar(this.api, this.message);


  @Input() basicInfo: BasicInfo = new BasicInfo();

  @Input() APPLICANT_ID!: number;

  clientAreaWidth!: number;

  selectedApplicant: number = 1;

  applicantOptions = [
    { lable: 'Applicant 1', value: 1 }
  ]

  changeApplicant(no_of_applicant: number) {
    this.selectedApplicant = 1;

    this.applicantOptions = [];

    for (let i = 0; i < no_of_applicant; i++) {
      this.applicantOptions.push({ lable: `Applicant ${i + 1}`, value: i + 1 })
    }

  }

  ngOnInit(): void {
    if (this.APPLICANT_ID) {
      this.getBasicInfo()
    }

    this.clientAreaWidth = window.screen.availWidth;
    this.setAllView();
    this.getMasters();
  }

  MASTERS = [
    { id: 2, data: <any>[], name: "title" },
  ]


  async getMasters() {
    for (let i = 0; i < this.MASTERS.length; i++) {
      let result = await lastValueFrom(this.api.getMasters(this.MASTERS[i].id));

      if (result['code'] == 200 && result["data"].length > 0) {
        this.MASTERS[i].data = result['data'];
      }
    }

    console.log('MASTERS', this.MASTERS);

  }


  saveAadhaarData(applicant_no: number) {
    if (applicant_no == 1) {
      this.aadhaarVerify.aadhar_history.APPLICANT_ID = this.APPLICANT_ID;
      this.aadhaarVerify.aadhar_history.APPLICANT_NO = 1;
      this.aadhaarVerify.aadhar_history.ADDRESS_ID = [this.aadhaarVerify.aadhar_address]
      this.basicInfo.AADHAAR_NO_1 = this.aadhaarVerify.aadhar_history.AADHAAR_NUMBER;
      this.saveAadhaar(this.aadhaarVerify.aadhar_history);
    }
    else if (applicant_no == 2) {
      this.aadhaarVerify2.aadhar_history.APPLICANT_ID = this.APPLICANT_ID;
      this.aadhaarVerify2.aadhar_history.APPLICANT_NO = 2;
      this.aadhaarVerify2.aadhar_history.ADDRESS_ID = [this.aadhaarVerify2.aadhar_address];
      this.basicInfo.AADHAAR_NO_2 = this.aadhaarVerify2.aadhar_history.AADHAAR_NUMBER;
      this.saveAadhaar(this.aadhaarVerify2.aadhar_history);
    }
    else if (applicant_no == 3) {
      this.aadhaarVerify3.aadhar_history.APPLICANT_ID = this.APPLICANT_ID;
      this.aadhaarVerify3.aadhar_history.APPLICANT_NO = 3;
      this.aadhaarVerify3.aadhar_history.ADDRESS_ID = [this.aadhaarVerify3.aadhar_address];
      this.basicInfo.AADHAAR_NUMBER3 = this.aadhaarVerify3.aadhar_history.AADHAAR_NUMBER;
      this.saveAadhaar(this.aadhaarVerify3.aadhar_history);
    }
    else if (applicant_no == 4) {
      this.aadhaarVerify4.aadhar_history.APPLICANT_ID = this.APPLICANT_ID;
      this.aadhaarVerify4.aadhar_history.APPLICANT_NO = 4;
      this.aadhaarVerify4.aadhar_history.ADDRESS_ID = [this.aadhaarVerify4.aadhar_address];
      this.basicInfo.AADHAAR_NUMBER4 = this.aadhaarVerify4.aadhar_history.AADHAAR_NUMBER;
      this.saveAadhaar(this.aadhaarVerify4.aadhar_history);
    }

  }

  private saveAadhaar(data: Aadhaar_History) {
    if (data.ID) {
      this.api.updateAadhaarData(data).subscribe({
        next: (res) => {
          if (res['code'] == 200) {
            //this.saveBasicInfo()
            if (data.APPLICANT_NO == 1) {
              this.getAdhaarHistory(1);
            }
            else if (data.APPLICANT_NO == 2) {
              this.getAdhaarHistory(2);
            }
            else if (data.APPLICANT_NO == 3) {
              this.getAdhaarHistory(3);
            }
            else if (data.APPLICANT_NO == 4) {
              this.getAdhaarHistory(4);
            }
          }
        }
      })
    }
    else {
      this.api.createAadhaarData(data).subscribe({
        next: (res) => {
          if (res['code'] == 200) {
            //this.saveBasicInfo()
            if (data.APPLICANT_NO == 1) {
              this.getAdhaarHistory(1);
            }
            else if (data.APPLICANT_NO == 2) {
              this.getAdhaarHistory(2);
            }
            else if (data.APPLICANT_NO == 3) {
              this.getAdhaarHistory(3);
            }
            else if (data.APPLICANT_NO == 4) {
              this.getAdhaarHistory(4);
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

    if (applicant_no == 1) {
      aadhaar_no = this.basicInfo.AADHAAR_NO_1;
    }

    else if (applicant_no == 2) {
      aadhaar_no = this.basicInfo.AADHAAR_NO_2;
    }

    else if (applicant_no == 3) {
      aadhaar_no = this.basicInfo.AADHAAR_NUMBER3;
    }

    else if (applicant_no == 4) {
      aadhaar_no = this.basicInfo.AADHAAR_NUMBER4;
    }

    this.api.getAadhaarData(applicant_no, aadhaar_no).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          if (applicant_no == 1) {
            this.aadhaarVerify.aadhar_history = res['data'][0];
            if (this.aadhaarVerify.aadhar_history.ADDRESS_ID.length > 0) {
              this.aadhaarVerify.aadhar_address = this.aadhaarVerify.aadhar_history.ADDRESS_ID[0];
            }
            // this.hideAadhar = true;
            this.aadhaarVerify.MakeHistory();
          }
          else if (applicant_no == 2) {
            this.aadhaarVerify2.aadhar_history = res['data'][0];
            if (this.aadhaarVerify2.aadhar_history.ADDRESS_ID.length > 0) {
              this.aadhaarVerify2.aadhar_address = this.aadhaarVerify2.aadhar_history.ADDRESS_ID[0];
            }
            // this.hideAadhar = true;
            this.aadhaarVerify2.MakeHistory();
          }

          else if (applicant_no == 3) {
            this.aadhaarVerify3.aadhar_history = res['data'][0];
            if (this.aadhaarVerify3.aadhar_history.ADDRESS_ID.length > 0) {
              this.aadhaarVerify3.aadhar_address = this.aadhaarVerify3.aadhar_history.ADDRESS_ID[0];
            }
            // this.hideAadhar = true;
            this.aadhaarVerify3.MakeHistory();
          }

          else if (applicant_no == 4) {
            this.aadhaarVerify4.aadhar_history = res['data'][0];
            if (this.aadhaarVerify4.aadhar_history.ADDRESS_ID.length > 0) {
              this.aadhaarVerify4.aadhar_address = this.aadhaarVerify4.aadhar_history.ADDRESS_ID[0];
            }
            // this.hideAadhar = true;
            this.aadhaarVerify4.MakeHistory();
          }
        }
      }
    })
  }


  savePanData(applicant_no: number) {
    if (applicant_no == 1) {
      this.aadhaarVerify.pan_history.APPLICANT_NO = 1;
      this.basicInfo.PAN_NUMBER = this.aadhaarVerify.pan_history.PAN_NUMBER;
      this.savePAN(this.aadhaarVerify.pan_history);
    }
    else if (applicant_no == 2) {
      this.aadhaarVerify2.pan_history.APPLICANT_NO = 2;
      this.basicInfo.PAN_NUMBER2 = this.aadhaarVerify2.pan_history.PAN_NUMBER;
      this.savePAN(this.aadhaarVerify2.pan_history);
    }
    else if (applicant_no == 3) {
      this.aadhaarVerify3.pan_history.APPLICANT_NO = 3;
      this.basicInfo.PAN_NUMBER3 = this.aadhaarVerify3.pan_history.PAN_NUMBER;
      this.savePAN(this.aadhaarVerify3.pan_history);
    }
    else if (applicant_no == 4) {
      this.aadhaarVerify4.pan_history.APPLICANT_NO = 4;
      this.basicInfo.PAN_NUMBER4 = this.aadhaarVerify4.pan_history.PAN_NUMBER;
      this.savePAN(this.aadhaarVerify4.pan_history);
    }
  }

  savePAN(PAN: Pan_History) {
    if (PAN.ID) {
      this.api.updatePanData(PAN).subscribe({
        next: (res) => {
          if (res['code'] == 200) {
            //this.saveBasicInfo();
            if (PAN.APPLICANT_NO == 1) {
              this.getPanHistory(1);
            }
            else if (PAN.APPLICANT_NO == 2) {
              this.getPanHistory(2);
            }
            else if (PAN.APPLICANT_NO == 3) {
              this.getPanHistory(3);
            }
            else if (PAN.APPLICANT_NO == 4) {
              this.getPanHistory(4);
            }
          }
          else {

          }
        },
        error: (err) => {

        }
      })
    }
    else {
      this.api.createPanData(PAN).subscribe({
        next: (res) => {
          //this.saveBasicInfo();
          if (res['code'] == 200) {
            if (PAN.APPLICANT_NO == 1) {
              this.getPanHistory(1);
            }
            else if (PAN.APPLICANT_NO == 2) {
              this.getPanHistory(2);
            }
            else if (PAN.APPLICANT_NO == 3) {
              this.getPanHistory(3);
            }
            else if (PAN.APPLICANT_NO == 4) {
              this.getPanHistory(4);
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

  // saveBasicInfo() {
  //   if (this.basicInfo.ID) {
  //     this.api.updateBasic(this.basicInfo).subscribe({
  //       next: (res) => {
  //         if (res.code == 200) {

  //         }
  //         else {


  //         }
  //       },
  //       error: (err) => {

  //       },
  //       complete: () => {
  //       }
  //     })
  //   }
  //   else {
  //     this.api.addBasic(this.basicInfo).subscribe({
  //       next: (res) => {
  //         if (res.code == 200) {
  //         }
  //         else {
  //         }
  //       },
  //       error: (err) => {
  //       },
  //       complete: () => {
  //       }
  //     })
  //   }
  // }

  getPanHistory(applicant_no: number) {
    let pan_no = '';

    if (applicant_no == 1) {
      pan_no = this.basicInfo.PAN_NUMBER;
    }

    else if (applicant_no == 2) {
      pan_no = this.basicInfo.PAN_NUMBER2;
    }
    else if (applicant_no == 3) {
      pan_no = this.basicInfo.PAN_NUMBER3;
    }
    else if (applicant_no == 4) {
      pan_no = this.basicInfo.PAN_NUMBER4;
    }

    this.api.getPanData(applicant_no, pan_no).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          if (applicant_no == 1) {
            this.aadhaarVerify.pan_history = res['data'][0];
          }
          else if (applicant_no == 2) {
            this.aadhaarVerify2.pan_history = res['data'][0];
          }
          else if (applicant_no == 3) {
            this.aadhaarVerify3.pan_history = res['data'][0];
          }
          else if (applicant_no == 4) {
            this.aadhaarVerify4.pan_history = res['data'][0];
          }
        }
      }
    })
  }

  async checkBalance(doc_id: number) {
    let suffR = await lastValueFrom(this.api.checkSufBal(doc_id));

    if (suffR['code'] == 200) {
      if (!suffR['isSufficient']) {
        this.message.error("Insufficient Balance.", "Please Recharge.")
        return 0;
      }
      return 1;
    }
    else {
      this.message.error("Something went wrong.", "Failed to fetch balance.")
      return 0;
    }
  }

  async Hit(doc_type: number) {
    let BRANCH_ID = Number(sessionStorage.getItem("BRANCH_ID"));
    let USER_ID = Number(sessionStorage.getItem("USER_ID"));
    let res = lastValueFrom(this.api.docVerifyHit(BRANCH_ID, USER_ID, doc_type));
  }

  async getOtp(AplicantNo: number) {

    if ((await this.checkBalance(1)) == 0) {
      return;
    }


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

      case 3: {
        this.loadOtpButton3 = true
        let otpData = this.aadhaarVerify3.getOTP();
        otpData.subscribe({
          next: (res) => {
            if (res == true) {
              this.loadOtpButton3 = false;

            }
            else {
              this.loadOtpButton3 = false;

            }
          },
          error: () => {
            this.loadOtpButton3 = false;

          }
        });
        break;
      }

      case 4: {
        this.loadOtpButton4 = true
        let otpData = this.aadhaarVerify4.getOTP();
        otpData.subscribe({
          next: (res) => {
            if (res == true) {
              this.loadOtpButton4 = false;

            }
            else {
              this.loadOtpButton4 = false;

            }
          },
          error: () => {
            this.loadOtpButton4 = false;

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
              this.Hit(1);
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
              this.Hit(1);
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

      case 3: {
        this.loadAadhaarButton3 = true
        let aadhar_data = this.aadhaarVerify3.getData();
        aadhar_data.subscribe({
          next: (res) => {
            if (res == true) {
              this.saveAadhaarData(3);
              this.Hit(1);
              this.loadAadhaarButton3 = false
            }
            else {
              this.loadAadhaarButton3 = false
            }
          },
          error: (err) => {
            this.loadAadhaarButton3 = false
          }

        });

        break;
      }

      case 4: {
        this.loadAadhaarButton4 = true
        let aadhar_data = this.aadhaarVerify4.getData();
        aadhar_data.subscribe({
          next: (res) => {
            if (res == true) {
              this.saveAadhaarData(4);
              this.Hit(1);
              this.loadAadhaarButton4 = false
            }
            else {
              this.loadAadhaarButton4 = false
            }
          },
          error: (err) => {
            this.loadAadhaarButton4 = false
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

  async verifyPan(AplicantNo: number) {

    if ((await this.checkBalance(2)) == 0) {
      return;
    }

    switch (AplicantNo) {
      case 1: {
        this.loadPanButton = true
        let panverify = this.aadhaarVerify.verifyPan();
        panverify.subscribe({
          next: (res) => {
            if (res == true) {
              this.basicInfo.PAN_NUMBER = this.aadhaarVerify.pan_history.PAN_NUMBER;
              this.savePanData(1);
              this.Hit(2);
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
              this.basicInfo.PAN_NUMBER2 = this.aadhaarVerify2.pan_history.PAN_NUMBER;
              this.savePanData(2);
              this.Hit(2);
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
      case 3: {
        this.loadPanButton3 = true;
        let panverify = this.aadhaarVerify3.verifyPan();
        panverify.subscribe({
          next: (res) => {
            if (res == true) {
              this.basicInfo.PAN_NUMBER3 = this.aadhaarVerify3.pan_history.PAN_NUMBER;
              this.savePanData(3);
              this.Hit(2);
              this.loadPanButton3 = false;
            }
            else {
              this.loadPanButton3 = false;
            }
          },
          error: () => {
            this.loadPanButton3 = false;
          }
        });
        break;
      }

      case 4: {
        this.loadPanButton4 = true;
        let panverify = this.aadhaarVerify4.verifyPan();
        panverify.subscribe({
          next: (res) => {
            if (res == true) {
              this.basicInfo.PAN_NUMBER4 = this.aadhaarVerify4.pan_history.PAN_NUMBER;
              this.savePanData(4);
              this.Hit(2);
              this.loadPanButton4 = false;
            }
            else {
              this.loadPanButton4 = false;
            }
          },
          error: () => {
            this.loadPanButton4 = false;
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



  save() {
    let personal: Subject<any> = new Subject();
    this.saveOVD();
    // this.basicInfo.STATUS = status;
    let isOk = true;

    for (let field of this.mendetory_all) {
      if (!this.basicInfo[field.field as keyof BasicInfo]) {
        this.message.error(`${field.message} is Mandetory`, '');
        isOk = false;
        personal.next({ code: 300 })
      }

    }

    if (this.basicInfo.NO_OF_APPLICANT == 2) {
      for (let field of this.mendetory_applicant_2) {
        if (!this.basicInfo[field.field as keyof BasicInfo]) {
          this.message.error(`${field.message} is Mandetory`, '');
          isOk = false;
          personal.next({ code: 300 })
        }
      }
    }

    if (this.basicInfo.IS_OLD_CUSTOMER_1) {
      for (let field of this.mendetory_customer) {
        if (!this.basicInfo[field.field as keyof BasicInfo]) {
          this.message.error(`${field.message} is Mandetory`, '');
          isOk = false;
          personal.next({ code: 300 })
        }

      }
    }



    if (isOk) {

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
        this.basicInfo.MAKER_USER_ID = Number(sessionStorage.getItem('USER_ID'));
        this.basicInfo.CREATED_BRANCH_ID = Number(sessionStorage.getItem('BRANCH_ID'));
        this.basicInfo.TRACK_ID = 1;

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

      if (this.aadhaarVerify.aadhar_history.AADHAAR_NUMBER) {

      }
      if (this.aadhaarVerify2.aadhar_history.AADHAAR_NUMBER) {

      }
    }


    return personal;
  }

  saveOVD() {
    if (this.aadhaarVerify.aadhar_history.AADHAAR_NUMBER) {
      this.saveAadhaarData(1)
    }
    if (this.aadhaarVerify2.aadhar_history.AADHAAR_NUMBER) {
      this.saveAadhaarData(2)
    }

    if (this.aadhaarVerify.pan_history.PAN_NUMBER) {
      this.savePanData(1)
    }
    if (this.aadhaarVerify2.pan_history.PAN_NUMBER) {
      this.savePanData(2)
    }

    if (this.aadhaarVerify.license_history.LICENSE_NUMBER) {
      this.saveLicenseData(1)
    }
    if (this.aadhaarVerify2.license_history.LICENSE_NUMBER) {
      this.saveLicenseData(2)
    }

    if (this.aadhaarVerify.voter_history.EPIC_NO) {
      this.saveVoterData(1)
    }
    if (this.aadhaarVerify2.voter_history.EPIC_NO) {
      this.saveVoterData(2)
    }
  }

  getBasicInfo() {
    this.api.getBasic(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.basicInfo = res['data'][0];
          this.changeApplicant(this.basicInfo.NO_OF_APPLICANT);
          this.getAdhaarHistory(1);
          this.getPanHistory(1);
          this.getVoterData(1);
          this.getLicenseData(1);
          if (this.basicInfo.NO_OF_APPLICANT >= 2) {
            this.getAdhaarHistory(2);
            this.getPanHistory(2);
            this.getVoterData(2);
            this.getLicenseData(2);
          }
          if (this.basicInfo.NO_OF_APPLICANT >= 3) {
            this.getAdhaarHistory(3);
            this.getPanHistory(3);
            this.getVoterData(3);
            this.getLicenseData(3);
          }
          if (this.basicInfo.NO_OF_APPLICANT >= 4) {
            this.getAdhaarHistory(4);
            this.getPanHistory(4);
            this.getVoterData(4);
            this.getLicenseData(4);
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

  loadVoterButton: boolean = false;
  loadVoterButton2: boolean = false;
  loadVoterButton3: boolean = false;
  loadVoterButton4: boolean = false;

  async verifyVoterID(AplicantNo: number) {

    if ((await this.checkBalance(3)) == 0) {
      return;
    }

    switch (AplicantNo) {
      case 1: {
        this.loadVoterButton = true

        let voterVerify = this.aadhaarVerify.verifyVoterID();

        voterVerify.subscribe({
          next: (res) => {
            if (res == true) {
              this.basicInfo.VOTER_ID_1 = this.aadhaarVerify.voter_history.EPIC_NO;
              this.saveVoterData(1);
              this.Hit(3);
              this.loadVoterButton = false
            }
            else {
              this.loadVoterButton = false
            }
          },
          error: () => {
            this.loadVoterButton = false
          }
        });
        break;
      }

      case 2: {
        this.loadVoterButton2 = true;
        let voterVerify = this.aadhaarVerify2.verifyVoterID();
        voterVerify.subscribe({
          next: (res) => {
            if (res == true) {
              this.basicInfo.VOTER_ID_2 = this.aadhaarVerify2.voter_history.EPIC_NO;
              this.saveVoterData(2);
              this.Hit(3);
              this.loadVoterButton2 = false;
            }
            else {
              this.loadVoterButton2 = false;
            }
          },
          error: () => {
            this.loadVoterButton2 = false;
          }
        });
        break;
      }

      case 3: {
        this.loadVoterButton3 = true;
        let voterVerify = this.aadhaarVerify3.verifyVoterID();
        voterVerify.subscribe({
          next: (res) => {
            if (res == true) {
              this.basicInfo.VOTER_ID_3 = this.aadhaarVerify3.voter_history.EPIC_NO;
              this.saveVoterData(3);
              this.Hit(3);
              this.loadVoterButton3 = false;
            }
            else {
              this.loadVoterButton3 = false;
            }
          },
          error: () => {
            this.loadVoterButton3 = false;
          }
        });
        break;
      }

      case 4: {
        this.loadVoterButton4 = true;
        let voterVerify = this.aadhaarVerify4.verifyVoterID();
        voterVerify.subscribe({
          next: (res) => {
            if (res == true) {
              this.basicInfo.VOTER_ID_4 = this.aadhaarVerify4.voter_history.EPIC_NO;
              this.saveVoterData(4);
              this.Hit(3);
              this.loadVoterButton4 = false;
            }
            else {
              this.loadVoterButton4 = false;
            }
          },
          error: () => {
            this.loadVoterButton4 = false;
          }
        });
        break;
      }

      default: {
        console.error("Inside function verifyVoterID : AplicantNo is Invalid - ", AplicantNo);
        break;
      }
    }

  }

  saveVoterData(applicant_no: number) {
    if (applicant_no == 1) {
      this.basicInfo.VOTER_ID_1 = this.aadhaarVerify.voter_history.EPIC_NO;
      this.saveVoter(this.aadhaarVerify.voter_history, applicant_no);
    }
    else if (applicant_no == 2) {
      this.basicInfo.VOTER_ID_2 = this.aadhaarVerify2.voter_history.EPIC_NO;
      this.saveVoter(this.aadhaarVerify2.voter_history, applicant_no);
    }

    else if (applicant_no == 3) {
      this.basicInfo.VOTER_ID_3 = this.aadhaarVerify3.voter_history.EPIC_NO;
      this.saveVoter(this.aadhaarVerify3.voter_history, applicant_no);
    }

    else if (applicant_no == 4) {
      this.basicInfo.VOTER_ID_4 = this.aadhaarVerify4.voter_history.EPIC_NO;
      this.saveVoter(this.aadhaarVerify4.voter_history, applicant_no);
    }
  }

  saveVoter(Voter: Voter_History, applicant_no: number) {
    if (Voter.ID) {
      this.api.updateVoterHistory(Voter).subscribe({
        next: (res) => {
          if (res['code'] == 200) {
            //this.saveBasicInfo();

            if (applicant_no == 1)
              this.getVoterData(1);

            if (applicant_no == 2)
              this.getVoterData(2);

            if (applicant_no == 3)
              this.getVoterData(3);

            if (applicant_no == 4)
              this.getVoterData(4);

          }
          else {

          }
        },
        error: (err) => {

        }
      })
    }
    else {
      this.api.createVoterHistory(Voter).subscribe({
        next: (res) => {
          //this.saveBasicInfo();
          if (res['code'] == 200) {
            if (applicant_no == 1) {
              this.getVoterData(1);
            }
            if (applicant_no == 2) {
              this.getVoterData(2);
            }
            if (applicant_no == 3) {
              this.getVoterData(3);
            }
            if (applicant_no == 4) {
              this.getVoterData(4);
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

  getVoterData(applicant_no: number) {
    let voter_id = '';

    if (applicant_no == 1) {
      voter_id = this.basicInfo.VOTER_ID_1;
    }

    else if (applicant_no == 2) {
      voter_id = this.basicInfo.VOTER_ID_2;
    }

    else if (applicant_no == 3) {
      voter_id = this.basicInfo.VOTER_ID_3;
    }

    else if (applicant_no == 4) {
      voter_id = this.basicInfo.VOTER_ID_4;
    }

    this.api.getVoterHistory(voter_id).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          if (applicant_no == 1) {
            this.aadhaarVerify.voter_history = res['data'][0];
          }
          else if (applicant_no == 2) {
            this.aadhaarVerify2.voter_history = res['data'][0];
          }
          else if (applicant_no == 3) {
            this.aadhaarVerify3.voter_history = res['data'][0];
          }
          else if (applicant_no == 4) {
            this.aadhaarVerify4.voter_history = res['data'][0];
          }
        }
      }
    })
  }


  loadLicenseButton: boolean = false;
  loadLicenseButton2: boolean = false;
  loadLicenseButton3: boolean = false;
  loadLicenseButton4: boolean = false;

  async verifyLicense(AplicantNo: number) {

    if ((await this.checkBalance(4)) == 0) {
      return;
    }

    switch (AplicantNo) {
      case 1: {
        this.loadLicenseButton = true

        let licenseVerify = this.aadhaarVerify.getLicenseData();

        licenseVerify.subscribe({
          next: (res) => {
            if (res == true) {
              this.basicInfo.LICENSE_NO_1 = this.aadhaarVerify.license_history.LICENSE_NUMBER;
              this.saveLicenseData(1);
              this.Hit(4);
              this.loadLicenseButton = false
            }
            else {
              this.loadLicenseButton = false
            }
          },
          error: () => {
            this.loadLicenseButton = false
          }
        });
        break;
      }

      case 2: {
        this.loadLicenseButton2 = true;
        let licenseVerify = this.aadhaarVerify2.getLicenseData();
        licenseVerify.subscribe({
          next: (res) => {
            if (res == true) {
              this.basicInfo.LICENSE_NO_2 = this.aadhaarVerify2.license_history.LICENSE_NUMBER;
              this.saveLicenseData(2);
              this.Hit(4);
              this.loadLicenseButton2 = false;
            }
            else {
              this.loadLicenseButton2 = false;
            }
          },
          error: () => {
            this.loadLicenseButton2 = false;
          }
        });
        break;
      }

      case 3: {
        this.loadLicenseButton3 = true;
        let licenseVerify = this.aadhaarVerify3.getLicenseData();
        licenseVerify.subscribe({
          next: (res) => {
            if (res == true) {
              this.basicInfo.LICENSE_NO_3 = this.aadhaarVerify3.license_history.LICENSE_NUMBER;
              this.saveLicenseData(3);
              this.Hit(4);
              this.loadLicenseButton3 = false;
            }
            else {
              this.loadLicenseButton3 = false;
            }
          },
          error: () => {
            this.loadLicenseButton3 = false;
          }
        });
        break;
      }

      case 4: {
        this.loadLicenseButton4 = true;
        let licenseVerify = this.aadhaarVerify4.getLicenseData();
        licenseVerify.subscribe({
          next: (res) => {
            if (res == true) {
              this.basicInfo.LICENSE_NO_4 = this.aadhaarVerify4.license_history.LICENSE_NUMBER;
              this.saveLicenseData(4);
              this.Hit(4);
              this.loadLicenseButton4 = false;
            }
            else {
              this.loadLicenseButton4 = false;
            }
          },
          error: () => {
            this.loadLicenseButton4 = false;
          }
        });
        break;
      }


      default: {
        console.error("Inside function verifyLicense : AplicantNo is Invalid - ", AplicantNo);
        break;
      }
    }


  }

  saveLicenseData(applicant_no: number) {
    if (applicant_no == 1) {
      this.basicInfo.LICENSE_NO_1 = this.aadhaarVerify.license_history.LICENSE_NUMBER;
      this.saveLicense(this.aadhaarVerify.license_history, applicant_no);
    }
    else if (applicant_no == 2) {
      this.basicInfo.LICENSE_NO_2 = this.aadhaarVerify2.license_history.LICENSE_NUMBER;
      this.saveLicense(this.aadhaarVerify2.license_history, applicant_no);
    }
    else if (applicant_no == 3) {
      this.basicInfo.LICENSE_NO_3 = this.aadhaarVerify3.license_history.LICENSE_NUMBER;
      this.saveLicense(this.aadhaarVerify3.license_history, applicant_no);
    }
    else if (applicant_no == 4) {
      this.basicInfo.LICENSE_NO_4 = this.aadhaarVerify4.license_history.LICENSE_NUMBER;
      this.saveLicense(this.aadhaarVerify4.license_history, applicant_no);
    }
  }

  saveLicense(license: License_History, applicant_no: number) {
    if (license.ID) {
      this.api.updateLicenseHistory(license).subscribe({
        next: (res) => {
          if (res['code'] == 200) {
            //this.saveBasicInfo();

            if (applicant_no == 1)
              this.getLicenseData(1);

            if (applicant_no == 2)
              this.getLicenseData(2);

            if (applicant_no == 3)
              this.getLicenseData(3);

            if (applicant_no == 4)
              this.getLicenseData(4);

          }
          else {

          }
        },
        error: (err) => {

        }
      })
    }
    else {
      this.api.createLicenseHistory(license).subscribe({
        next: (res) => {
          //this.saveBasicInfo();
          if (res['code'] == 200) {
            if (applicant_no == 1) {
              this.getLicenseData(1);
            }
            if (applicant_no == 2) {
              this.getLicenseData(2);
            }
            if (applicant_no == 3) {
              this.getLicenseData(3);
            }
            if (applicant_no == 4) {
              this.getLicenseData(4);
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

  getLicenseData(applicant_no: number) {
    let license_no = '';

    if (applicant_no == 1) {
      license_no = this.basicInfo.LICENSE_NO_1;
    }

    else if (applicant_no == 2) {
      license_no = this.basicInfo.LICENSE_NO_2;
    }

    else if (applicant_no == 3) {
      license_no = this.basicInfo.LICENSE_NO_3;
    }

    else if (applicant_no == 4) {
      license_no = this.basicInfo.LICENSE_NO_4;
    }

    this.api.getLicenseHistory(license_no).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          if (applicant_no == 1) {
            this.aadhaarVerify.license_history = res['data'][0];
          }
          else if (applicant_no == 2) {
            this.aadhaarVerify2.license_history = res['data'][0];
          }
          else if (applicant_no == 3) {
            this.aadhaarVerify3.license_history = res['data'][0];
          }
          else if (applicant_no == 4) {
            this.aadhaarVerify4.license_history = res['data'][0];
          }
        }
      }
    })
  }

  previewAdhaar1: string = '';
  previewAdhaar2: string = '';
  previewAdhaar3: string = '';
  previewAdhaar4: string = '';

  showAadharNo(value: string, num: number) {
    if (num == 1) {
      this.previewAdhaar1 = value;
    }
    else if (num == 2) {
      this.previewAdhaar2 = value;
    }
    else if (num == 3) {
      this.previewAdhaar3 = value;
    }
    else if (num == 4) {
      this.previewAdhaar4 = value;
    }
  }

  saveDocuments() {
    if (this.aadhaarVerify.aadhar_history.AADHAAR_NUMBER) {
      this.saveAadhaarData(1);
    }
    if (this.aadhaarVerify2.aadhar_history.AADHAAR_NUMBER) {
      this.saveAadhaarData(2);
    }
  }

  calculateAge(applicant_no: 1 | 2 | 3 | 4) {

    let key: 'AGE_1' | 'AGE_2' | 'AGE_3' | 'AGE_4' = `AGE_${applicant_no}`
    let dob_key: 'DOB_1' | 'DOB_2' | 'DOB_3' | 'DOB_4' = `DOB_${applicant_no}`
    let Age = this.basicInfo[dob_key];
    if (Age) {
      let ageArray = Age.split('/');
      let year = ~~ageArray[2];
      let currentDate = new Date();
      let currentYear = currentDate.getFullYear();
      this.basicInfo[key] = currentYear - year;
    }
    else {
      this.basicInfo[key] = 0;
    }
  }



  noApplicantSize: number = 6;
  cardSize: number = 11;
  spaceInbetween: number = 2;

  setAllView() {
    if (this.clientAreaWidth < 1000) {
      this.noApplicantSize = 10;
      this.cardSize = 24;
      this.spaceInbetween = 0;
    }
    else {
      this.noApplicantSize = 6;
      this.cardSize = 11;
      this.spaceInbetween = 2;
    }
  }

  searchData: any

  async searchCustomer() {
    if (this.basicInfo.CUSTOMER_ID_1) {
      let res: any = await lastValueFrom(this.api.searchCustomer(this.basicInfo.CUSTOMER_ID_1));
      if (res['code'] == 200) {
        this.searchData = res['data'];

        if (this.searchData.ALREADY_EXIST == 'Y') {
          this.message.error("This Customer Already Have An Individual Account.", "")
        }
        else {
          this.aadhaarVerify.pan_history.PAN_NUMBER = this.searchData.PAN;
          this.basicInfo.MOBILE_1 = this.searchData.MOBILE;
          this.basicInfo.GENDER_1 = this.searchData.GENDER;
          this.basicInfo.PRIMARY_APPLICANT_FIRST_NAME = this.searchData.FIRST_NAME;
          this.basicInfo.PRIMARY_APPLICANT_MIDDLE_NAME = this.searchData.MIDDLE_NAME;
          this.basicInfo.PRIMARY_APPLICANT_LAST_NAME = this.searchData.LAST_NAME;

          this.basicInfo.DOB_1 = this.convertDate(this.searchData.BIRTHDATE);
          this.calculateAge(1)
        }
        console.log("serachData", this.searchData)
      }
      else if (res['code'] == 404) {
        this.message.error("No Customer Found.", '');
      }
      else {
        this.message.error("Something Went Wrong", '');
      }
    }
    else {
      this.message.error("Please Enter Customer ID.", '');
    }

  }

  convertDate(date: string) {
    let arr = date.split(" ");

    let firstPart = arr[0].split("-");

    let dd = firstPart[0], mm = firstPart[1], yy = firstPart[2];

    return `${dd}/${mm}/${yy}`;
  }

}
