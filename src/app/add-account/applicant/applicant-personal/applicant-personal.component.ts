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
  @Input() personalInfo!:PersonalInfo;
  constructor(private api:ApiService,private message:NzNotificationService) { }

  ngOnInit(): void {
  }

  getApplicantPersonal(){
   
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

}
