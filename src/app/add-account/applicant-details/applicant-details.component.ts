import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { PersonalInfo } from 'src/app/models/personal-info';
import { ApiService } from 'src/app/service/api.service';
import { ApplicantTabsComponent } from '../applicant/applicant-tabs/applicant-tabs.component';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { BasicInfo } from 'src/app/models/basicInfo';

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

  @ViewChild('noActionTamplate', { static: false }) noActionFooter?: TemplateRef<{}>;

  @Input() dataList: any[] = [];


  APPLICANT_ID?: number;
  ApplicantData: PersonalInfo[] = new Array<PersonalInfo>;
  drawerReferance: any
  saveButtonLoading: boolean = false;
  saveButtonTitle: string = 'Save and Next';
  DrawerVisible: boolean = false;
  personalInfo: PersonalInfo = new PersonalInfo();

  basicInfo: BasicInfo = new BasicInfo();

  constructor(private api: ApiService, private message: NzNotificationService, private drawerService: NzDrawerService) { }

  ngOnInit(): void {

  }

  convertToNumber() {
    this.personalInfo.CURRENT_AREA = Number(this.personalInfo.CURRENT_AREA)
    this.personalInfo.PERMANENT_AREA = Number(this.personalInfo.PERMANENT_AREA)
    this.personalInfo.CURRENT_CITY = Number(this.personalInfo.CURRENT_CITY)
    this.personalInfo.PERMANENT_CITY = Number(this.personalInfo.PERMANENT_CITY)
    this.personalInfo.CURRENT_TALUKA = Number(this.personalInfo.CURRENT_TALUKA)
    this.personalInfo.PERMANENT_TALUKA = Number(this.personalInfo.PERMANENT_TALUKA)
    this.personalInfo.CURRENT_DISTRICT = Number(this.personalInfo.CURRENT_DISTRICT)
    this.personalInfo.PERMANENT_DISTRICT = Number(this.personalInfo.PERMANENT_DISTRICT)
    this.personalInfo.CURRENT_STATE = Number(this.personalInfo.CURRENT_STATE)
    this.personalInfo.PERMANENT_STATE = Number(this.personalInfo.PERMANENT_STATE)
  }


  edit(data: PersonalInfo) {
    this.personalInfo = data;

    this.convertToNumber();

    let ROLE_ID = Number(sessionStorage.getItem('ROLE_ID'));


    let title;

    let footer;

    if (ROLE_ID == 1 && this.basicInfo.TRACK_ID == 1) {
      footer = this.applicantFooterTemplate;
      title = "Fill Applicant All Info";
    }
    else {
      footer = this.noActionFooter;
      title = "See All the Info";
    }

    const drawerRef = this.drawerService.create({
      nzTitle: title,
      nzFooter: footer,
      nzContent: this.applicantTamplate,
      nzWidth: window.innerWidth
    });

    this.drawerReferance = drawerRef;

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Template) open');
    });

    drawerRef.afterClose.subscribe(() => {
      console.log('Drawer(Template) close');
      this.showPreviousButton = false;
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
      this.showPreviousButton = false
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

  next() {
    this.saveButtonLoading = true;
    if (this.tabComp.selectedTab == 0) {
      this.tabComp.financialComp.getApplicantFinacial();
      this.tabComp.selectedTab = 1;
      this.tabComp.disabledTabs[0].disabled = true;
      this.tabComp.disabledTabs[1].disabled = false;
      this.showPreviousButton = true
      this.saveButtonLoading = false;
    }

    else if (this.tabComp.selectedTab == 1) {

      this.tabComp.propertyComp.getApplicantProperty();
      this.tabComp.selectedTab = 2;
      this.tabComp.disabledTabs[1].disabled = true;
      this.tabComp.disabledTabs[2].disabled = false;
      this.saveButtonTitle = 'Save and Next';

      this.saveButtonLoading = false;

    }

    else if (this.tabComp.selectedTab == 2) {
      this.saveButtonTitle = 'Save and Next';
      this.tabComp.disabledTabs[2].disabled = true;
      this.drawerReferance.close();
      this.saveButtonLoading = false;
    }

  }

}
