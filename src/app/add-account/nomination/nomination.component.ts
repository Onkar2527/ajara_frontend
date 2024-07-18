import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Subject } from 'rxjs';
import { NomineeDetails } from 'src/app/models/nominee-details';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-nomination',
  templateUrl: './nomination.component.html',
  styleUrls: ['./nomination.component.css'],
})
export class NominationComponent implements OnInit {

  optionList = [
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
    },
    {
      label: 'Grand Father',
      value: 'I'
    },
    {
      label: 'Grand Mother',
      value: 'J'
    },
    {
      label: 'Aunty',
      value: 'K'
    },
    {
      label: 'Cousin',
      value: 'L'
    },
    {
      label: 'Daughter in law',
      value: 'M'
    },
    {
      label: 'Father in law',
      value: 'N'
    },
    {
      label: 'Friend',
      value: 'O'
    },
    {
      label: 'Grand Daughter',
      value: 'P'
    },
    {
      label: 'Grand Son',
      value: 'Q'
    },
    {
      label: 'Mother in law',
      value: 'R'
    },
    {
      label: 'Nephew',
      value: 'S'
    },
    {
      label: 'Uncle',
      value: 'T'
    },
    {
      label: 'Other',
      value: 'U'
    }
  ]

  constructor(private api: ApiService, private message: NzNotificationService) { }
  APPLICANT_ID!: number
  nomineeInfo: NomineeDetails = new NomineeDetails();
  ngOnInit(): void {
  }

  mendetory_all = [
    { field: 'DOB', message: "Nominee's DOB" },
    { field: 'NOMINEE_NAME', message: 'Name of Nominee' },
    { field: 'RELATION', message: "Relationship with Applicant" },
    { field: 'NOMINEE_ADDRESS', message: 'Address of Nominee' }
  ]

  mendetory_minor = [
    { field: 'APONITED_NAME', message: "Name of Appointed Person" },
    { field: 'APONITED_ADDRESS', message: 'Address of Appointed Person' },
  ]

  save() {
    let nominee: Subject<any> = new Subject();

    let isOk = true;

    for (let field of this.mendetory_all) {
      if (!this.nomineeInfo[field.field as keyof NomineeDetails]) {
        this.message.error(`${field.message} is Mandatory`, '');
        isOk = false;
      }
    }

    if (this.nomineeInfo.IS_MINOR) {
      for (let field of this.mendetory_minor) {
        if (!this.nomineeInfo[field.field as keyof NomineeDetails]) {
          this.message.error(`${field.message} is Mandatory`, '');
          isOk = false;
        }
      }
    }

    if (isOk) {
      if (this.nomineeInfo.ID) {
        this.api.updateNominee(this.nomineeInfo).subscribe({
          next: (res) => {
            if (res.code == 200) {
              this.message.success("Nominee Information updated successfully!", '');
              this.getNominationInfo();
              nominee.next(res);
            }
            else {
              this.message.error('Failed to update Nominee info', '');
              nominee.next(res);
            }
          },
          error: (err) => {
            this.message.error("Internal Server Error!", err);
            nominee.error('err')
          },
          complete: () => {
            console.info("Add Nominee Info Request Completed!");
            nominee.complete();
          }
        })
      }
      else {
        this.api.addNominee(this.nomineeInfo).subscribe({
          next: (res) => {
            if (res.code == 200) {
              this.message.success("Nominee Information added successfully!", '');
              this.getNominationInfo();
              nominee.next(res);
            }
            else {
              this.message.error('Failed to add Nominee info', '');
              nominee.next(res);
            }
          },
          error: (err) => {
            this.message.error("Internal Server Error!", err);
            nominee.error('err')
          },
          complete: () => {
            console.info("Add Nominee Info Request Completed!");
            nominee.complete();
          }
        })
      }
    }
    else {
      nominee.error("All mendetory fields are not filled");
    }


    return nominee;
  }

  getNominationInfo() {
    this.api.getNominee(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.nomineeInfo = res['data'][0];
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

  calculateAge() {
    let Age = this.nomineeInfo.DOB;
    if (Age) {
      let ageArray = Age.split('/');
      let year = ~~ageArray[2];
      let currentDate = new Date();
      let currentYear = currentDate.getFullYear();
      this.nomineeInfo.NOMINEE_AGE = currentYear - year;
    }
    else {
      this.nomineeInfo.NOMINEE_AGE = 0;
    }
  }
}
