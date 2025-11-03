import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, lastValueFrom } from 'rxjs';
import { BasicInfo } from 'src/app/models/basicInfo';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
})
export class PersonalComponent implements OnInit {
  @Input() basicInfo: BasicInfo = new BasicInfo();
  @Input() APPLICANT_ID!: number;

  applicants: number[] = [];
  noApplicantSize: number = 6;

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) {}

  ngOnInit(): void {
    if (this.APPLICANT_ID) {
      this.getBasicInfo();
    } else {
      this.updateApplicants();
    }
  }

  updateApplicants() {
    this.applicants = Array.from(
      { length: this.basicInfo.NO_OF_APPLICANT },
      (_, i) => i + 1
    );
  }

  addApplicant() {
    this.basicInfo.NO_OF_APPLICANT++;
    this.updateApplicants();
  }

  removeApplicant(applicantNo: number) {
    this.applicants.splice(this.applicants.indexOf(applicantNo), 1);
    this.basicInfo.NO_OF_APPLICANT--;
    // Clean up data for the removed applicant
    for (const key in this.basicInfo) {
      if (key.endsWith(`_${applicantNo}`)) {
        delete this.basicInfo[key];
      }
    }
  }

  getBasicInfo() {
    this.api.getBasic(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.basicInfo = res['data'][0];
          if (this.basicInfo['APPLICANTS_DATA']) {
            const applicants = this.basicInfo['APPLICANTS_DATA'];
            this.basicInfo['applicants'] = applicants;
            applicants.forEach((applicant: any, index: number) => {
              const i = index + 1;
              i == 1
                ? (this.basicInfo[`PRIMARY_APPLICANT_FIRST_NAME`] =
                    applicant.FIRST_NAME)
                : (this.basicInfo[`APPLICANT${i}_FIRST_NAME`] =
                    applicant.FIRST_NAME);
              i == 1
                ? (this.basicInfo[`PRIMARY_APPLICANT_MIDDLE_NAME`] =
                    applicant.MIDDLE_NAME)
                : (this.basicInfo[`APPLICANT${i}_MIDDLE_NAME`] =
                    applicant.MIDDLE_NAME);
              i == 1
                ? (this.basicInfo[`PRIMARY_APPLICANT_LAST_NAME`] =
                    applicant.LAST_NAME)
                : (this.basicInfo[`APPLICANT${i}_LAST_NAME`] =
                    applicant.LAST_NAME);
              this.basicInfo[`AADHAAR_NO_${i}`] = applicant.AADHAAR_NO;
              this.basicInfo[`PAN_NUMBER${i > 1 ? i : ''}`] =
                applicant.PAN_NUMBER;
              this.basicInfo[`CUSTOMER_ID_${i}`] = applicant.CUSTOMER_ID;
              this.basicInfo[`CKYC_NUMBER_${i}`] = applicant.CKYC_NUMBER;
              this.basicInfo[`VOTER_ID_${i}`] = applicant.VOTER_ID;
              this.basicInfo[`LICENSE_NO_${i}`] = applicant.LICENSE_NO;
              this.basicInfo[`DOB_${i}`] = applicant.DOB;
              this.basicInfo[`GENDER_${i}`] = applicant.GENDER;
              this.basicInfo[`MOBILE_${i}`] = applicant.MOBILE;
              this.basicInfo[`AGE_${i}`] = applicant.AGE;
              this.basicInfo[`OTP_AUTH_${i}`] = applicant.OTP_AUTH;
              this.basicInfo[`IS_OLD_CUSTOMER_${i}`] =
                applicant.IS_OLD_CUSTOMER;
              this.basicInfo[`CUSTOMER_TYPE_${i}`] = applicant.CUSTOMER_TYPE;
            });
          }
          this.basicInfo.IS_AADHAAR_DBT = this.basicInfo.IS_AADHAAR_DBT
            ? true
            : false;
          this.updateApplicants();
        }
      },
    });
  }

  save() {
    let personal: Subject<any> = new Subject();
    let isOk = true;

    const applicantsData = [];
    for (let i = 1; i <= this.basicInfo.NO_OF_APPLICANT; i++) {
      const applicant = {
        APPLICANT_NO: i,
        FIRST_NAME:
          this.basicInfo[
            i == 1 ? 'PRIMARY_APPLICANT_FIRST_NAME' : `APPLICANT${i}_FIRST_NAME`
          ],
        MIDDLE_NAME:
          this.basicInfo[
            i == 1
              ? 'PRIMARY_APPLICANT_MIDDLE_NAME'
              : `APPLICANT${i}_MIDDLE_NAME`
          ],
        LAST_NAME:
          this.basicInfo[
            i == 1 ? 'PRIMARY_APPLICANT_LAST_NAME' : `APPLICANT${i}_LAST_NAME`
          ],
        AADHAAR_NO: this.basicInfo[`AADHAAR_NO_${i}`],
        PAN_NUMBER: this.basicInfo[`PAN_NUMBER${i > 1 ? i : ''}`],
        CUSTOMER_ID: this.basicInfo[`CUSTOMER_ID_${i}`],
        CKYC_NUMBER: this.basicInfo[`CKYC_NUMBER_${i}`],
        VOTER_ID: this.basicInfo[`VOTER_ID_${i}`],
        LICENSE_NO: this.basicInfo[`LICENSE_NO_${i}`],
        DOB: this.basicInfo[`DOB_${i}`],
        GENDER: this.basicInfo[`GENDER_${i}`],
        MOBILE: this.basicInfo[`MOBILE_${i}`],
        AGE: this.basicInfo[`AGE_${i}`],
        OTP_AUTH: this.basicInfo[`OTP_AUTH_${i}`],
        IS_OLD_CUSTOMER: this.basicInfo[`IS_OLD_CUSTOMER_${i}`],
        CUSTOMER_TYPE: this.basicInfo[`CUSTOMER_TYPE_${i}`],
      };
      applicantsData.push(applicant);
    }

    const dataToSend = { ...this.basicInfo, applicants: applicantsData };

    if (dataToSend.IS_OLD_CUSTOMER_1 && !dataToSend.CUSTOMER_ID_1) {
      this.message.error('Applicant 1 Customer ID is Mandatory', '');
      isOk = false;
      personal.next({ code: 300 });
    }

    if (!dataToSend.ID) {
      dataToSend.MAKER_USER_ID = Number(sessionStorage.getItem('USER_ID'));
      dataToSend.CREATED_BRANCH_ID = Number(
        sessionStorage.getItem('BRANCH_ID')
      );
      dataToSend.TRACK_ID = 1;
    }

    if (isOk) {
      const apiCall = dataToSend.ID
        ? this.api.updateBasic(dataToSend)
        : this.api.addBasic(dataToSend);

      apiCall.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success(
              `Personal Information ${
                dataToSend.ID ? 'updated' : 'added'
              } successfully!`,
              ''
            );
            if (!dataToSend.ID) {
              this.APPLICANT_ID = res['APPLICANT_ID'];
            }
            this.getBasicInfo();
            personal.next(res);
          } else {
            this.message.error(
              `Failed to ${dataToSend.ID ? 'update' : 'add'} personal info`,
              ''
            );
            personal.next(res);
          }
        },
        error: (err) => {
          this.message.error('Internal Server Error!', err);
          personal.error('err');
        },
        complete: () => {
          console.info('Add Personal Info Request Completed!');
          personal.complete();
        },
      });
    }
    return personal;
  }
}
