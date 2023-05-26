import { Component, OnInit, ViewChild, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Aadhaar } from 'src/app/models/aadhaar';
import { BasicInfo } from 'src/app/models/basicInfo';
import { Facilities } from 'src/app/models/facilities';
import { NomineeDetails } from 'src/app/models/nominee-details';
import { TermDeposite } from 'src/app/models/term-deposite';
import { ApiService } from 'src/app/service/api.service';
import { ApplicantDetailsComponent } from '../applicant-details/applicant-details.component';
import { DepositComponent } from '../deposit/deposit.component';
import { FormComponent } from '../form/form.component';
import { NominationComponent } from '../nomination/nomination.component';
import { PersonalComponent } from '../personal/personal.component';
import { ServicesComponent } from '../services/services.component';
import { WebCamComponent } from '../web-cam/web-cam.component';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit, OnDestroy {
  @ViewChild(PersonalComponent) personalComp!: PersonalComponent;
  @ViewChild(DepositComponent) depositeComp!: DepositComponent;
  @ViewChild(ServicesComponent) serviceComp!: ServicesComponent;
  @ViewChild(NominationComponent) nomineeComp!: NominationComponent;
  // @ViewChild(FormComponent) formComp!: FormComponent;
  @ViewChild(ApplicantDetailsComponent) applicantDetail!:ApplicantDetailsComponent;
  // @ViewChild(WebCamComponent) wecamComp!:WebCamComponent;


  @Input() BasicInfo:BasicInfo = new BasicInfo();
  constructor(private api: ApiService, private message: NzNotificationService) { }
  @Output() ChangeIndex = new EventEmitter<number>();

  

  Tabs = [
    { Index: 0, disabled: false },
    { Index: 1, disabled: true },
    { Index: 2, disabled: true },
    { Index: 3, disabled: true },
    { Index: 4, disabled: true },
    { Index: 5, disabled: true },
    { Index: 6, disabled: true },
  ]

  selectedIndex: number = 0;

  changeIndex(){
    console.log(this.selectedIndex,"is selected index")
    this.ChangeIndex.emit(this.selectedIndex);
  }

  loadSaveButton: boolean = false;
  loadPreviousButton: boolean = false;
  buttonTitle: string = 'Save & Next'
  APPLICANT_ID!: number;
  log(event: any) {
    if (this.selectedIndex == 4) {
      this.buttonTitle = 'Download Pdf'
    }
    else {
      this.buttonTitle = 'Save & Next'
    }
   
  }
  ngOnInit(): void {
    
  }
  ngOnDestroy() {

  }

  saveANext() {

    this.loadSaveButton = true;

    if (this.selectedIndex == 0) {
      let personal = this.personalComp.save();
      this.depositeComp.depositInfo.ACCOUNT_TYPE = this.personalComp.basicInfo.ACCOUNT_TYPE;
      this.serviceComp.AccountType = this.personalComp.basicInfo.ACCOUNT_TYPE;
      personal.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.APPLICANT_ID = this.BasicInfo.ID;
            this.depositeComp.APPLICANT_ID = this.APPLICANT_ID;
            this.depositeComp.getDepositInfo();
            this.Tabs[0].disabled = true;
            this.Tabs[1].disabled = false;
            this.selectedIndex = 1;
            this.changeIndex();
            this.loadSaveButton = false;
          }
        }, error: () => {
          this.loadSaveButton = false;
        },
        complete: () => {
          this.loadSaveButton = false;
        }
      })
    }
    else if (this.selectedIndex == 1) {
      this.depositeComp.depositInfo.APPLICANT_ID = this.APPLICANT_ID;
      let deposite = this.depositeComp.save();
      deposite.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.nomineeComp.APPLICANT_ID = this.APPLICANT_ID;
            this.nomineeComp.getNominationInfo();
            this.Tabs[1].disabled = true;
            this.Tabs[2].disabled = false;
            this.selectedIndex = 2;
            this.changeIndex();
            this.loadSaveButton = false;
          }
        },
        error: () => {
          this.loadSaveButton = false;
        },
        complete: () => {
          this.loadSaveButton = false;
        }
      })
    }
    else if (this.selectedIndex == 2) {
      this.nomineeComp.nomineeInfo.APPLICANT_ID = this.APPLICANT_ID;
      let nominee = this.nomineeComp.save();
      nominee.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.serviceComp.APPLICANT_ID = this.APPLICANT_ID;
            this.serviceComp.getServiceInfo();
            this.Tabs[2].disabled = true;
            this.Tabs[3].disabled = false;
            this.selectedIndex = 3;
            this.changeIndex();
            this.loadSaveButton = false;
          }
        }, error: () => {
          this.loadSaveButton = false;
        },
        complete: () => {
          this.loadSaveButton = false;
        }
      })
    }

    else if (this.selectedIndex == 3) {

      this.serviceComp.serviceInfo.APPLICANT_ID = this.APPLICANT_ID;
      let service = this.serviceComp.save();
      service.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.Tabs[3].disabled = true;
            this.Tabs[4].disabled = false;
            this.selectedIndex = 4;
            this.changeIndex();
            this.applicantDetail.APPLICANT_ID = this.APPLICANT_ID;
            this.applicantDetail.getAllApplicant();
            this.loadSaveButton = false;
          }
        }, error: () => {
          this.loadSaveButton = false;
        },
        complete: () => {
          this.loadSaveButton = false;
        }
      })
    }
    else if (this.selectedIndex == 4) {
      // this.wecamComp.APPLICANT_ID = this.APPLICANT_ID;
      // this.wecamComp.getApplicant();
      this.Tabs[4].disabled = true;
      // this.Tabs[5].disabled = false;
      
      this.selectedIndex = 5;
      this.changeIndex();
      this.loadSaveButton = false;
    }
    else if (this.selectedIndex == 5) {
      this.Tabs[5].disabled = true;
      this.Tabs[6].disabled = false;
      // this.formComp.APPLICANT_ID = this.APPLICANT_ID;
      // this.formComp.getAllData();
      this.loadSaveButton = false;
      this.selectedIndex = 6;
      this.changeIndex();
    }
    else if (this.selectedIndex == 6) {
      // this.formComp.save()
      this.loadSaveButton = false;
    }
  }

  previous() {

    this.loadPreviousButton = true;

    if (this.selectedIndex == 6) {
      this.Tabs[6].disabled = true;
      this.Tabs[5].disabled = false;
      this.selectedIndex = 5;
      this.loadPreviousButton = false;
    }
    else if (this.selectedIndex == 5) {
      this.Tabs[5].disabled = true;
      this.Tabs[4].disabled = false;
      this.selectedIndex = 4;
      this.loadPreviousButton = false;
    }
    else if (this.selectedIndex == 4) {
      this.Tabs[4].disabled = true;
      this.Tabs[3].disabled = false;
      this.selectedIndex = 3;
      this.loadPreviousButton = false;
    }
    else if (this.selectedIndex == 3) {
      this.Tabs[3].disabled = true;
      this.Tabs[2].disabled = false;
      this.selectedIndex = 2;
      this.loadPreviousButton = false;
    }
    else if (this.selectedIndex == 2) {
      this.Tabs[2].disabled = true;
      this.Tabs[1].disabled = false;
      this.selectedIndex = 1;
      this.loadPreviousButton = false;
    }
    else if (this.selectedIndex == 1) {
      this.Tabs[1].disabled = true;
      this.Tabs[0].disabled = false;
      this.selectedIndex = 0;
      this.loadPreviousButton = false;
    }
    else if (this.selectedIndex == 0) {
      this.loadPreviousButton = false;
    }

  }

  saveAsDraft() {
    if (this.selectedIndex == 0) {
      let personal = this.personalComp.save();
      personal.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.reset();
          }
        }, error: () => {
          
        },
        complete: () => {
          
        }
      })
    }

    else if (this.selectedIndex == 1) {
      this.depositeComp.depositInfo.APPLICANT_ID = this.APPLICANT_ID;
      let deposite = this.depositeComp.save();
      deposite.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.reset();
          }
        },
        error: () => {
          
        },
        complete: () => {
         
        }
      })
    }
    else if (this.selectedIndex == 2) {
      this.nomineeComp.nomineeInfo.APPLICANT_ID = this.APPLICANT_ID;
      let nominee = this.nomineeComp.save();
      nominee.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.reset();
          }
        }, error: () => {
          
        },
        complete: () => {
          
        }
      })
    }

    else if (this.selectedIndex == 3) {
      this.serviceComp.serviceInfo.APPLICANT_ID = this.APPLICANT_ID;
      let service = this.serviceComp.save();
      service.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.reset();
          }
        }, error: () => {
          
        },
        complete: () => {
          
        }
      })
    }
    else if (this.selectedIndex == 4) {
      this.reset();

    }
    else if (this.selectedIndex == 5) {
      this.reset();
    }
    else if (this.selectedIndex == 6) {
      this.reset();
    }

  }

  reset() {

    this.selectedIndex = 0;
    this.Tabs = [
      { Index: 0, disabled: false },
      { Index: 1, disabled: true },
      { Index: 2, disabled: true },
      { Index: 3, disabled: true },
      { Index: 4, disabled: true },
      { Index: 5, disabled: true },
      { Index: 6, disabled: true },
    ]
    this.personalComp.basicInfo = new BasicInfo();
    this.personalComp.aadhaarVerify = new Aadhaar(this.api, this.message);
    this.personalComp.aadhaarVerify2 = new Aadhaar(this.api, this.message);
    this.personalComp.aadhaarVerify3 = new Aadhaar(this.api, this.message);
    this.personalComp.aadhaarVerify4= new Aadhaar(this.api, this.message);


    this.depositeComp.depositInfo = new TermDeposite();
    this.serviceComp.serviceInfo = new Facilities();
    this.nomineeComp.nomineeInfo = new NomineeDetails();
  }

  saveAsComplete(){
    let personal = this.personalComp.save();
      this.personalComp.basicInfo.STATUS = 'C';
      personal.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.reset();
          }
        }, error: () => {
         
        },
        complete: () => {
         
        }
      })
  }

}
