import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject, lastValueFrom } from 'rxjs';
import { BasicInfo } from 'src/app/models/basicInfo';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  @Input() basicInfo: BasicInfo = new BasicInfo();
  @Input() APPLICANT_ID!: number;

  applicants: number[] = [];
  noApplicantSize: number = 6;

  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnInit(): void {
    if (this.APPLICANT_ID) {
      this.getBasicInfo();
    } else {
      this.updateApplicants();
    }
  }

  updateApplicants() {
    this.applicants = Array.from({ length: this.basicInfo.NO_OF_APPLICANT }, (_, i) => i + 1);
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
          this.basicInfo.IS_AADHAAR_DBT = this.basicInfo.IS_AADHAAR_DBT ? true : false;
          this.updateApplicants();
        }
      }
    });
  }

  save() {
    let personal: Subject<any> = new Subject();
    let isOk = true;

    if (this.basicInfo.IS_OLD_CUSTOMER_1 && !this.basicInfo.CUSTOMER_ID_1) {
      this.message.error('Applicant 1 Customer ID is Mandatory', '');
      isOk = false;
      personal.next({ code: 300 });
    }

    if (isOk) {
      const apiCall = this.basicInfo.ID ? this.api.updateBasic(this.basicInfo) : this.api.addBasic(this.basicInfo);

      apiCall.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success(`Personal Information ${this.basicInfo.ID ? 'updated' : 'added'} successfully!`, '');
            if (!this.basicInfo.ID) {
              this.APPLICANT_ID = res['APPLICANT_ID'];
            }
            this.getBasicInfo();
            personal.next(res);
          } else {
            this.message.error(`Failed to ${this.basicInfo.ID ? 'update' : 'add'} personal info`, '');
            personal.next(res);
          }
        },
        error: (err) => {
          this.message.error("Internal Server Error!", err);
          personal.error('err');
        },
        complete: () => {
          console.info("Add Personal Info Request Completed!");
          personal.complete();
        }
      });
    }
    return personal;
  }
}
