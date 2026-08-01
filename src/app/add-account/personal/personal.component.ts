import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, lastValueFrom } from 'rxjs';
import { BasicInfo } from 'src/app/models/basicInfo';
import { ApiService } from 'src/app/service/api.service';
import { ApplicantComponent } from './applicant/applicant.component';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css'],
})
export class PersonalComponent implements OnInit {
  @Input() basicInfo: BasicInfo = new BasicInfo();
  @Input() APPLICANT_ID!: number;
  isMinor: boolean = false;

  @ViewChildren(ApplicantComponent) applicantComps!: QueryList<ApplicantComponent>;

  applicants: number[] = [];
  noApplicantSize: number = 6;
  isGuardian: boolean = false;

  constructor(
    private api: ApiService,
    private message: NzNotificationService
  ) { }

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
    if (this.isGuardian && this.applicants.length >= 2) {
      this.message.error('Cannot add more than one guardian.', '');
      return;
    }
    this.basicInfo.NO_OF_APPLICANT++;
    this.updateApplicants();
  }

  addGuardian() {
    if (this.applicants.length < this.noApplicantSize) {
      this.isGuardian = true;
      this.addApplicant();
    }
  }

  removeGuardian() {
    this.isGuardian = false;
  }

  handleIsMinor(isMinor: boolean) {
    if (isMinor) {
      this.addGuardian();
    } else {
      this.removeGuardian();
    }
  }

  removeApplicant(applicantNo: number) {
    if (this.isGuardian && applicantNo === 2) {
      this.isGuardian = false;
    }
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
            let applicants = this.basicInfo['APPLICANTS_DATA'];
            if (typeof applicants === 'string') {
              try {
                applicants = JSON.parse(applicants);
              } catch (e) {
                applicants = [];
              }
            }
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
          if (this.basicInfo['AGE_1'] < 18) {
            this.isMinor = true;
            this.isGuardian = true;
          }
          this.updateApplicants();
        }
      },
    });
  }

  save() {
    let personal: Subject<any> = new Subject();
    let isOk = true;

    // 1. Sync PAN Number from child components to basicInfo
    if (this.applicantComps) {
      for (let i = 1; i <= this.basicInfo.NO_OF_APPLICANT; i++) {
        const comp = this.applicantComps.find(c => c.applicantNo === i);
        if (comp && comp.aadhaarVerify?.pan_history?.PAN_NUMBER) {
          this.basicInfo['PAN_NUMBER' + (i > 1 ? i : '')] = comp.aadhaarVerify.pan_history.PAN_NUMBER.trim();
        }
      }
    }

    // 2. Perform validations and duplicate checks asynchronously
    (async () => {
      try {
        // Validate fields for each applicant
        for (let i = 1; i <= this.basicInfo.NO_OF_APPLICANT; i++) {
          const isOld = this.basicInfo['IS_OLD_CUSTOMER_' + i];
          if (!isOld) {
            const title = this.basicInfo['CUSTOMER_TYPE_' + i];
            const firstName = this.basicInfo[i == 1 ? 'PRIMARY_APPLICANT_FIRST_NAME' : `APPLICANT${i}_FIRST_NAME`];
            const mobile = this.basicInfo['MOBILE_' + i];
            const dob = this.basicInfo['DOB_' + i];
            const docAuthority = this.basicInfo[i == 1 ? 'DOCUMENTS_AUTHORITY' : `DOCUMENTS_AUTHORITY_${i}`];
            const docIssuePlace = this.basicInfo[i == 1 ? 'DOCUMENTS_ISSUE_PLACE' : `DOCUMENTS_ISSUE_PLACE_${i}`];
            const panNumber = this.basicInfo['PAN_NUMBER' + (i > 1 ? i : '')];

            const label = i === 1 ? 'Primary Applicant' : `Applicant ${i}`;

            if (!title || !title.trim()) {
              this.message.error(`${label} Title is mandatory.`, '');
              isOk = false;
              break;
            }
            if (!firstName || !firstName.trim()) {
              this.message.error(`${label} First Name is mandatory.`, '');
              isOk = false;
              break;
            }
            if (!dob || !dob.trim()) {
              this.message.error(`${label} Date of Birth is mandatory.`, '');
              isOk = false;
              break;
            }
            if (!mobile || !mobile.trim()) {
              this.message.error(`${label} Mobile Number is mandatory.`, '');
              isOk = false;
              break;
            }
            if (!/^[6-9]\d{9}$/.test(mobile)) {
              this.message.error(`${label} Mobile Number is invalid. It must be a 10-digit number starting with 6, 7, 8 or 9.`, '');
              isOk = false;
              break;
            }
            if (!docAuthority || !docAuthority.trim()) {
              this.message.error(`${label} Issued Document Authority is mandatory.`, '');
              isOk = false;
              break;
            }
            if (!docIssuePlace || !docIssuePlace.trim()) {
              this.message.error(`${label} Place of issue is mandatory.`, '');
              isOk = false;
              break;
            }
            if (!panNumber || !panNumber.trim()) {
              this.message.error(`${label} PAN Number is mandatory.`, '');
              isOk = false;
              break;
            }
          }
        }

        // Check if PAN already exists using getCustomer API (only for new account creation)
        if (isOk && !this.basicInfo.ID) {
          for (let i = 1; i <= this.basicInfo.NO_OF_APPLICANT; i++) {
            const isOld = this.basicInfo['IS_OLD_CUSTOMER_' + i];
            if (!isOld) {
              const panNumber = this.basicInfo['PAN_NUMBER' + (i > 1 ? i : '')];
              if (panNumber) {
                try {
                  const res: any = await lastValueFrom(this.api.searchCustomer('', '', panNumber, 'PAN'));
                  if (res?.code === 200) {
                    const label = i === 1 ? 'Primary Applicant' : `Applicant ${i}`;
                    this.message.error(`${label}'s PAN Number ${panNumber} already exists in CBS!`, '');
                    isOk = false;
                    break;
                  }
                } catch (e: any) {
                  console.error(e);
                  if (e?.status === 200 || e?.error?.code === 200) {
                    const label = i === 1 ? 'Primary Applicant' : `Applicant ${i}`;
                    this.message.error(`${label}'s PAN Number ${panNumber} already exists in CBS!`, '');
                    isOk = false;
                    break;
                  }
                }
              }
            }
          }
        }

        if (!isOk) {
          personal.next({ code: 300 });
          personal.complete();
          return;
        }

        // If validations pass, construct the final applicants array and call API
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
            IS_MINOR: (i == 1) ? this.basicInfo['IS_MINOR'] : false
          };
          applicantsData.push(applicant);
        }

        const dataToSend = { ...this.basicInfo, applicants: applicantsData };

        if (dataToSend.IS_OLD_CUSTOMER_1 && !dataToSend.CUSTOMER_ID_1) {
          this.message.error('Applicant 1 Customer ID is Mandatory', '');
          personal.next({ code: 300 });
          personal.complete();
          return;
        }

        if (!dataToSend.ID) {
          dataToSend.MAKER_USER_ID = Number(sessionStorage.getItem('USER_ID'));
          dataToSend.CREATED_BRANCH_ID = Number(
            sessionStorage.getItem('BRANCH_ID')
          );
          dataToSend.TRACK_ID = 1;
        }

        const apiCall = dataToSend.ID
          ? this.api.updateBasic(dataToSend)
          : this.api.addBasic(dataToSend);

        apiCall.subscribe({
          next: (res) => {
            if (res.code == 200) {
              this.message.success(
                `Personal Information ${dataToSend.ID ? 'updated' : 'added'
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
      } catch (err) {
        console.error("Error in personalComp save:", err);
        personal.next({ code: 300 });
        personal.complete();
      }
    })();

    return personal;
  }
}
