import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PersonalInfo } from 'src/app/models/personal-info';
import { ApiService } from 'src/app/service/api.service';
import { ApplicantTabsComponent } from '../applicant/applicant-tabs/applicant-tabs.component';

@Component({
  selector: 'app-applicant-details',
  templateUrl: './applicant-details.component.html',
  styleUrls: ['./applicant-details.component.css']
})
export class ApplicantDetailsComponent implements OnInit {

  @ViewChild(ApplicantTabsComponent) tabComp!: ApplicantTabsComponent;

  APPLICANT_ID?:number;
  ApplicantData: PersonalInfo[] = [];

  saveButtonLoading: boolean = false;
  saveButtonTitle: string = 'Save and Next';
  DrawerVisible: boolean = false;
  personalInfo:PersonalInfo = new PersonalInfo()
  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnInit(): void {
    
  }

  close() {
    
    this.DrawerVisible = false;
  }

  edit(data: PersonalInfo) {
    this.personalInfo = data;
    this.DrawerVisible = true;
  }

  save() {
    this.saveButtonLoading = true;
    if (this.tabComp.selectedTab == 0) {

      this.tabComp.selectedTab = 1;
      this.tabComp.disabledTabs[0].disabled = true;
      this.tabComp.disabledTabs[1].disabled = false;

      this.saveButtonLoading = false;
    }
    else if (this.tabComp.selectedTab == 1) {

      this.tabComp.selectedTab = 2;

      this.tabComp.disabledTabs[1].disabled = true;
      this.tabComp.disabledTabs[2].disabled = false;

      this.saveButtonLoading = false;
    }
    else if (this.tabComp.selectedTab == 2) {
      this.tabComp.selectedTab = 3;

      this.tabComp.disabledTabs[2].disabled = true;
      this.tabComp.disabledTabs[3].disabled = false;

      this.saveButtonLoading = false;
    }
    else if (this.tabComp.selectedTab == 3) {
      this.saveButtonTitle = 'Save and Close'
      this.tabComp.selectedTab = 4;
      this.tabComp.disabledTabs[3].disabled = true;
      this.tabComp.disabledTabs[4].disabled = false;
      this.saveButtonLoading = false;
    }
    else if (this.tabComp.selectedTab == 4) {
      this.saveButtonTitle = 'Save and Next';
      this.saveButtonLoading = false;
      this.close();
    }
  }

  previous() {

    // if (this.tabComp.selectedTab == 0) {

    //   this.tabComp.selectedTab = 1;
    //   this.tabComp.disabledTabs[0].disabled = true;
    //   this.tabComp.disabledTabs[1].disabled = false;

    //   this.saveButtonLoading = false;
    // }

    if (this.tabComp.selectedTab == 1) {

      this.tabComp.selectedTab = 0;

      this.tabComp.disabledTabs[1].disabled = true;
      this.tabComp.disabledTabs[0].disabled = false;

      
    }

    else if (this.tabComp.selectedTab == 2) {
      this.tabComp.selectedTab = 1;

      this.tabComp.disabledTabs[2].disabled = true;
      this.tabComp.disabledTabs[1].disabled = false;

      this.saveButtonLoading = false;
    }

    else if (this.tabComp.selectedTab == 3) {
     
      this.tabComp.selectedTab = 2;
      this.tabComp.disabledTabs[3].disabled = true;
      this.tabComp.disabledTabs[2].disabled = false;
    }

    else if (this.tabComp.selectedTab == 4) {
      this.saveButtonTitle = 'Save and Next';
      this.tabComp.selectedTab = 3;
      this.tabComp.disabledTabs[4].disabled = true;
      this.tabComp.disabledTabs[3].disabled = false;
    }

  }

  getAllApplicant(){
    this.api.getAllAplicant(this.APPLICANT_ID).subscribe({
      next:(res)=>{
        if(res['code'] == 200){
          this.ApplicantData = res['data'];
        }
      }
    })
  }

}
