import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BasicInfo } from 'src/app/models/basicInfo';
import { ExtraInfo } from 'src/app/models/extra-info';
import { ApiService } from 'src/app/service/api.service';
import { CheckerVerificationComponent } from 'src/app/verification/checker-verification/checker-verification.component';
import { VerifierVerificationComponent } from 'src/app/verification/verifier-verification/verifier-verification.component';
import { ApplicantDetailsComponent } from '../applicant-details/applicant-details.component';
import { DepositComponent } from '../deposit/deposit.component';
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
  // @ViewChild(FormComponent) formComp!: FormComponent;
  @ViewChild(ApplicantDetailsComponent) applicantDetail!: ApplicantDetailsComponent;
  // @ViewChild(WebCamComponent) wecamComp!:WebCamComponent;

  @ViewChild(CheckerVerificationComponent) checkerComp!: CheckerVerificationComponent;
  @ViewChild(VerifierVerificationComponent) verifierComp!: VerifierVerificationComponent;



  @Input() BasicInfo: BasicInfo = new BasicInfo();
  constructor(private api: ApiService, private message: NzNotificationService) { }
  @Output() ChangeIndex = new EventEmitter<number>();
  @Output() CloseDrawer = new EventEmitter<void>();




  @Input() Tabs: ExtraInfo[] = []

  selectedIndex: number = 0;

  changeIndex() {
    console.log(this.selectedIndex, "is selected index")
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
    if (this.BasicInfo.ID) {
      this.getTabs(this.BasicInfo.ID);
      this.APPLICANT_ID = this.BasicInfo.ID;
    }

  }
  ngOnDestroy() {

  }

  completeVerifier() {

    let send_to_refill = false

    for (let tab of this.Tabs) {
      if (tab.SEND_TO_REFILL) {
        send_to_refill = true;
        break;
      }
    }

    if (send_to_refill) {
      let personal = this.personalComp.save('D');
      this.personalComp.basicInfo.STATUS = 'D';
      personal.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success("Proposal has been sent to Refill", '')
            this.CloseDrawer.emit();
          }
          else {
            this.message.error("Something went wrong", '');
          }
        }, error: () => {

        },
        complete: () => {

        }
      })
    }

    else {
      let personal = this.personalComp.save('V');
      this.personalComp.basicInfo.STATUS = 'V';
      personal.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success("Account has been created", '')
            this.CloseDrawer.emit();
          }
          else {
            this.message.error("Something went wrong", '');
          }
        }, error: () => {

        },
        complete: () => {

        }
      })
    }

  }

  completeChecker() {
    let send_to_refill = false
    for (let tab of this.Tabs) {
      if (tab.SEND_TO_REFILL) {
        send_to_refill = true;
        break;
      }
    }

    if (send_to_refill) {
      let personal = this.personalComp.save('D');
      this.personalComp.basicInfo.STATUS = 'D';
      personal.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success("Proposal has been sent to Refill", '')
            this.CloseDrawer.emit();
          }
          else {
            this.message.error("Something went wrong", '');
          }
        }, error: () => {

        },
        complete: () => {

        }
      })
    }

    else {
      let personal = this.personalComp.save('V');
      this.personalComp.basicInfo.STATUS = 'V';
      personal.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.message.success("Proposal has been sent to Verification", '')
            this.CloseDrawer.emit();
          }
          else {
            this.message.error("Something went wrong", '');
          }
        }, error: () => {

        },
        complete: () => {

        }
      })
    }
  }


  getTabs(applicant_id: number) {
    this.api.getTabs(applicant_id, sessionStorage.getItem('ROLE_ID')).subscribe({
      next: (res) => {
        if (res['code'] && res['data']) {
          // let data = this.api.decryptData(res['data']);
          this.Tabs = res['data'];
          // this.personalComp.APPLICANT_ID = applicant_id;
          // this.personalComp.getBasicInfo();
          this.reset();
          console.log("tabs = ", this.Tabs);
        }
      }
    })
  }


  updateTabsProvided(index: number) {
    this.Tabs[index].IS_PROVIDED = true;

    this.api.updateTab(this.Tabs[index]).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.selectedIndex = index + 1;
          this.changeIndex();
        }
        else {
          this.Tabs[index].IS_PROVIDED = false;
        }
      },
      error: () => {
        this.Tabs[index].IS_PROVIDED = false;
      }
    })

  }

  checkerDisable: boolean = true;
  verifierDisable: boolean = true;

  sendToRefill(index: number, remark: string, user: string) {
    this.Tabs[index].SEND_TO_REFILL_COUNT++;
    this.Tabs[index].SEND_TO_REFILL = true;

    if (user == 'C') {
      this.Tabs[index].IS_CHECKED = false;
      this.Tabs[index].CHECKER_REMARK = remark;
    }
    if (user == 'V') {
      this.Tabs[index].IS_VERIFIED = false;
      this.Tabs[index].VERIFIER_REMARK = remark;
    }


    this.api.updateTab(this.Tabs[index]).subscribe({
      next: (res) => {
        if (res['code'] == 200) {

          if (this.selectedIndex == 0) {
            this.APPLICANT_ID = this.BasicInfo.ID;
            this.depositeComp.APPLICANT_ID = this.APPLICANT_ID;
            this.depositeComp.getDepositInfo();
            this.Tabs[0].disabled = true;
            this.Tabs[1].disabled = false;
            this.selectedIndex++;
            this.changeIndex();

          }

          else if (this.selectedIndex == 1) {
            this.nomineeComp.APPLICANT_ID = this.APPLICANT_ID;
            this.nomineeComp.getNominationInfo();
            this.Tabs[1].disabled = true;
            this.Tabs[2].disabled = false;
            this.selectedIndex++;
            this.changeIndex();

          }

          else if (this.selectedIndex == 2) {
            this.serviceComp.APPLICANT_ID = this.APPLICANT_ID;
            this.serviceComp.getServiceInfo();
            this.Tabs[2].disabled = true;
            this.Tabs[3].disabled = false;
            this.selectedIndex++;
            this.changeIndex();

          }

          else if (this.selectedIndex == 3) {
            this.applicantDetail.APPLICANT_ID = this.APPLICANT_ID;
            this.applicantDetail.getAllApplicant();
            this.Tabs[3].disabled = true;
            this.Tabs[4].disabled = false;
            this.selectedIndex++;
            this.changeIndex();
          }

          else if (this.selectedIndex == 4) {
            this.Tabs[4].disabled = true
            if (user == 'C') {
              this.checkerDisable = false;
              this.checkerComp.Tabs = this.Tabs;
            }

            if (user == 'V') {
              this.verifierDisable = false;
              this.verifierComp.Tabs = this.Tabs;
            }
            this.selectedIndex++;
            this.changeIndex();
          }

        }
        else {

        }
      },
      error: () => {

      }
    });
  }

  Accept(index: number, user: string) {
    this.Tabs[index].SEND_TO_REFILL = false;

    if (user == 'C') {
      this.Tabs[index].IS_CHECKED = true;
      this.Tabs[index].CHECKER_REMARK = '';
    }
    if (user == 'V') {
      this.Tabs[index].IS_VERIFIED = true;
      this.Tabs[index].VERIFIER_REMARK = '';
    }


    this.api.updateTab(this.Tabs[index]).subscribe({
      next: (res) => {
        if (res['code'] == 200) {

          if (this.selectedIndex == 0) {
            this.APPLICANT_ID = this.BasicInfo.ID;
            this.depositeComp.APPLICANT_ID = this.APPLICANT_ID;
            this.depositeComp.getDepositInfo();
            this.Tabs[0].disabled = true;
            this.Tabs[1].disabled = false;
            this.selectedIndex++;
            this.changeIndex();

          }

          else if (this.selectedIndex == 1) {
            this.nomineeComp.APPLICANT_ID = this.APPLICANT_ID;
            this.nomineeComp.getNominationInfo();
            this.Tabs[1].disabled = true;
            this.Tabs[2].disabled = false;
            this.selectedIndex++;
            this.changeIndex();

          }

          else if (this.selectedIndex == 2) {
            this.serviceComp.APPLICANT_ID = this.APPLICANT_ID;
            this.serviceComp.getServiceInfo();
            this.Tabs[2].disabled = true;
            this.Tabs[3].disabled = false;
            this.selectedIndex++;
            this.changeIndex();

          }

          else if (this.selectedIndex == 3) {
            this.applicantDetail.APPLICANT_ID = this.APPLICANT_ID;
            this.applicantDetail.getAllApplicant();
            this.Tabs[3].disabled = true;
            this.Tabs[4].disabled = false;
            this.selectedIndex++;
            this.changeIndex();
          }

          else if (this.selectedIndex == 4) {
            this.Tabs[4].disabled = true
            if (user == 'C') {
              this.checkerDisable = false;
              this.checkerComp.Tabs = this.Tabs;
            }

            if (user == 'V') {
              this.verifierDisable = false;
              this.verifierComp.Tabs = this.Tabs;
            }
            this.selectedIndex++;
            this.changeIndex();
          }

        }
        else {

        }
      },
      error: () => {

      }
    });
  }


  saveANext() {

    this.loadSaveButton = true;

    if (this.selectedIndex == 0) {
      let personal = this.personalComp.save('D');
      // this.depositeComp.account_type = this.personalComp.basicInfo.ACCOUNT_TYPE;
      // this.serviceComp.AccountType = this.personalComp.basicInfo.ACCOUNT_TYPE;
      personal.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.APPLICANT_ID = this.BasicInfo.ID;
            this.depositeComp.APPLICANT_ID = this.APPLICANT_ID;

            this.depositeComp.getDepositInfo();
            this.Tabs[0].disabled = true;
            this.Tabs[1].disabled = false;
            this.updateTabsProvided(this.selectedIndex);
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
            this.updateTabsProvided(this.selectedIndex);
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
            this.updateTabsProvided(this.selectedIndex);
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
            this.updateTabsProvided(this.selectedIndex);
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
      this.Tabs[4].disabled = true;
      this.updateTabsProvided(this.selectedIndex);
      this.saveAsComplete();
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
      let personal = this.personalComp.save('D');
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

    }

  }

  reset() {

    this.selectedIndex = 0;
    for (let i = 0; i < this.Tabs.length; i++) {
      if (i == 0) {
        this.Tabs[0].disabled = false;
      }
      else {
        this.Tabs[i].disabled = true;
      }

    }

  }

  saveAsComplete() {
    let personal = this.personalComp.save('C');
    this.personalComp.basicInfo.STATUS = 'C';
    personal.subscribe({
      next: (res) => {
        if (res.code == 200) {
          this.message.success("Proposal has been sent to verify", '')
          this.CloseDrawer.emit();
        }
        else {
          this.message.error("Something went wrong", '');
        }
      }, error: () => {

      },
      complete: () => {

      }
    })
  }

}
