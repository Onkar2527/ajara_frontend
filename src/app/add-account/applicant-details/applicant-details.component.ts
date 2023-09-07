import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PersonalInfo } from 'src/app/models/personal-info';
import { ApiService } from 'src/app/service/api.service';
import { ApplicantTabsComponent } from '../applicant/applicant-tabs/applicant-tabs.component';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-applicant-details',
  templateUrl: './applicant-details.component.html',
  styleUrls: ['./applicant-details.component.css']
})
export class ApplicantDetailsComponent implements OnInit {

  @ViewChild(ApplicantTabsComponent) tabComp!: ApplicantTabsComponent;

  @ViewChild('applicantTamplate', { static: false }) applicantTamplate?: TemplateRef<{
    $implicit: {};
    drawerRef: NzDrawerRef<any>;
  }>;

  @ViewChild('footertpl', { static: false }) applicantFooterTemplate?: TemplateRef<{}>;

  APPLICANT_ID?: number;
  ApplicantData: PersonalInfo[] = new Array<PersonalInfo>;
  drawerReferance: any
  saveButtonLoading: boolean = false;
  saveButtonTitle: string = 'Save and Next';
  DrawerVisible: boolean = false;
  personalInfo: PersonalInfo = new PersonalInfo()
  constructor(private api: ApiService, private message: NzNotificationService, private drawerService: NzDrawerService) { }

  ngOnInit(): void {

  }



  edit(data: PersonalInfo) {
    this.personalInfo = data;

    const drawerRef = this.drawerService.create({
      nzTitle: "Fill Applicant All Info",
      nzFooter: this.applicantFooterTemplate,
      nzContent: this.applicantTamplate,
      nzWidth: 1095
    });

    this.drawerReferance = drawerRef;

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Template) open');
    });

    drawerRef.afterClose.subscribe(() => {
      console.log('Drawer(Template) close');
      this.getAllApplicant();
    });

  }

  save() {
    this.saveButtonLoading = true;
    if (this.tabComp.selectedTab == 0) {
      let personal = this.tabComp.personalComp.save();
      personal.subscribe({
        next: (res) => {
          if (res.code == 200) {

            this.tabComp.financialComp.getApplicantFinacial();
            this.tabComp.selectedTab = 1;
            this.tabComp.disabledTabs[0].disabled = true;
            this.tabComp.disabledTabs[1].disabled = false;
            this.showPreviousButton = true
            this.saveButtonLoading = false;
          }
        }, error: () => {
          this.saveButtonLoading = false;
        },
        complete: () => {
          this.saveButtonLoading = false;
        }
      })
    }

    else if (this.tabComp.selectedTab == 1) {
     
      let financial = this.tabComp.financialComp.save();
      financial.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.tabComp.propertyComp.getApplicantProperty();
            this.tabComp.selectedTab = 2;
            this.tabComp.disabledTabs[1].disabled = true;
            this.tabComp.disabledTabs[2].disabled = false;
            this.saveButtonTitle = 'Save and Next';

            this.saveButtonLoading = false;
          }
        }, error: () => {
          this.saveButtonLoading = false;
        },
        complete: () => {
          this.saveButtonLoading = false;
        }
      })


    }
    else if (this.tabComp.selectedTab == 2) {

      let property = this.tabComp.propertyComp.save();
      property.subscribe({
        next: (res) => {
          if (res.code == 200) {
            // this.tabComp.loanInfoComp.getApplicantLoanInfo();
            // this.tabComp.selectedTab = 3;
            this.saveButtonTitle = 'Save and Next';
            this.tabComp.disabledTabs[2].disabled = true;
            // this.tabComp.disabledTabs[3].disabled = false;
            this.drawerReferance.close();
            this.saveButtonLoading = false;

          }
        }, error: () => {
          this.saveButtonLoading = false;
        },
        complete: () => {
          this.saveButtonLoading = false;
        }
      })


    }
    // else if (this.tabComp.selectedTab == 3) {
    //   let loanInfo = this.tabComp.loanInfoComp.save();
    //   loanInfo.subscribe({
    //     next: (res) => {
    //       if (res.code == 200) {
    //         this.tabComp.otherBankAccountComp.getApplicantOtherBankAccount();

    //         this.saveButtonTitle = 'Save and Close'
    //         this.tabComp.selectedTab = 4;
    //         this.tabComp.disabledTabs[3].disabled = true;
    //         this.tabComp.disabledTabs[4].disabled = false;
    //         this.saveButtonLoading = false;

    //       }
    //     }, error: () => {
    //       this.saveButtonLoading = false;
    //     },
    //     complete: () => {
    //       this.saveButtonLoading = false;
    //     }
    //   })

    // }
    // else if (this.tabComp.selectedTab == 4) {

    //   let otherBank = this.tabComp.otherBankAccountComp.save();
    //   otherBank.subscribe({
    //     next: (res) => {
    //       if (res.code == 200) {
    //         this.saveButtonTitle = 'Save and Next';
    //         this.saveButtonLoading = false;
    //         this.drawerReferance.close();

    //       }
    //     }, error: () => {
    //       this.saveButtonLoading = false;
    //     },
    //     complete: () => {
    //       this.saveButtonLoading = false;
    //     }
    //   })


    // }
  }

  showPreviousButton = false;

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
      this.showPreviousButton = false
      this.saveButtonLoading = false;
    }

    // else if (this.tabComp.selectedTab == 3) {

    //   this.tabComp.selectedTab = 2;
    //   this.tabComp.disabledTabs[3].disabled = true;
    //   this.tabComp.disabledTabs[2].disabled = false;
    // }

    // else if (this.tabComp.selectedTab == 4) {
    //   this.saveButtonTitle = 'Save and Next';
    //   this.tabComp.selectedTab = 3;
    //   this.tabComp.disabledTabs[4].disabled = true;
    //   this.tabComp.disabledTabs[3].disabled = false;
    // }

  }

  getAllApplicant() {
    this.api.getAllAplicant(this.APPLICANT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.ApplicantData = res['data'];
        }
      }
    })
  }

}
