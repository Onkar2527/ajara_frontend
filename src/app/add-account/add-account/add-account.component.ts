import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DepositComponent } from '../deposit/deposit.component';
import { FormComponent } from '../form/form.component';
import { NominationComponent } from '../nomination/nomination.component';
import { PersonalComponent } from '../personal/personal.component';
import { ServicesComponent } from '../services/services.component';

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
  @ViewChild(FormComponent) formComp!: FormComponent;

  constructor() { }

  selectedIndex: number = 0;
  loanSaveButton: boolean = false;
  buttonTitle:string='Save & Next' 
  APPLICANT_ID?:number;
  log(event: any) {
    if(this.selectedIndex == 4){
      this.buttonTitle = 'Download Pdf'
    }
    else{
      this.buttonTitle = 'Save & Next'
    }
    console.info("tab index changed", event, this.selectedIndex)
  }
  ngOnInit(): void {
  }
  ngOnDestroy() {

  }

  saveANext() {

    this.loanSaveButton = true;
    if (this.selectedIndex == 0) {
      let personal = this.personalComp.save();
      personal.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.APPLICANT_ID = res.APPLICANT_ID;
            this.selectedIndex = 1;
           
            this.loanSaveButton = false;
          }
        }, error:()=>{
          this.loanSaveButton = false;
        },
        complete: () => {
          this.loanSaveButton = false;
        }
      })
    }
    else if (this.selectedIndex == 1) {
      this.depositeComp.depositInfo.APPLICANT_ID = this.APPLICANT_ID;
      let deposite = this.depositeComp.save();
      deposite.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.selectedIndex = 2;
           
            this.loanSaveButton = false;
          }
        },
        error:()=>{
          this.loanSaveButton = false;
        },
        complete: () => {
          this.loanSaveButton = false;
        }
      })
    }
    else if (this.selectedIndex == 2) {
      this.nomineeComp.nomineeInfo.APPLICANT_ID = this.APPLICANT_ID;
      let nominee = this.nomineeComp.save();
      nominee.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.selectedIndex = 3;
          
            this.loanSaveButton = false;
          }
        }, error:()=>{
          this.loanSaveButton = false;
        },
        complete: () => {
          this.loanSaveButton = false;
        }
      })
    }

    else if(this.selectedIndex == 3){
      this.serviceComp.serviceInfo.APPLICANT_ID = this.APPLICANT_ID;
      let service = this.serviceComp.save();
      service.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.formComp.APPLICANT_ID = this.APPLICANT_ID;
            this.formComp.getAllData();
            this.selectedIndex = 4;
            this.loanSaveButton = false;
          }
        }, error:()=>{
          this.loanSaveButton = false;
        },
        complete: () => {
          this.loanSaveButton = false;
        }
      })
    }
    else if(this.selectedIndex == 4){
      
    }
  }

 

}
