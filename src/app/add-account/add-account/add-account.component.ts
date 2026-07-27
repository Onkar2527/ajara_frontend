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
import { RemarkCompComponent } from '../remark-comp/remark-comp.component';
import { RemarkModel } from 'src/app/models/remark-model';
import { lastValueFrom } from 'rxjs';


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

  @ViewChild(RemarkCompComponent) remarkComp!: RemarkCompComponent;


  @Input() BasicInfo: BasicInfo = new BasicInfo();
  constructor(private api: ApiService, private message: NzNotificationService) { }
  @Output() ChangeIndex = new EventEmitter<number>();
  @Output() CloseDrawer = new EventEmitter<void>();
  @Output() AccountCreationStatus = new EventEmitter<boolean>();



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
      this.getTabs(this.BasicInfo.ID, this.BasicInfo.TRACK_ID);
      this.APPLICANT_ID = this.BasicInfo.ID;
    }

  }
  ngOnDestroy() {

  }

  isTestMode: boolean = false;
  isTestModalVisible: boolean = false;
  testJsonPayloadString: string = '';
  isConfirmingAccount: boolean = false;

  closeTestModal() {
    this.isTestModalVisible = false;
  }

  async confirmAccountCreationInTestMode() {
    this.isConfirmingAccount = true;
    try {
      let onBoardingResult = await lastValueFrom(this.api.onBoardCustomer(this.personalComp.basicInfo.ID, false));
      this.isConfirmingAccount = false;

      if (onBoardingResult && onBoardingResult['code'] == 200) {
        this.isTestModalVisible = false;
        this.message.success("customer created. ", `Customer ID = ${onBoardingResult.success_data['Customer Code']}`);
        this.AccountCreationStatus.emit(false);

        this.personalComp.basicInfo.TRACK_ID = 4;
        let personal = this.personalComp.save();
        personal.subscribe({
          next: (res) => {
            if (res.code == 200) {
              this.saveRemark();
              this.message.success("Account has been created", `Account Number = ${onBoardingResult.success_data['Account number']}`);
              this.CloseDrawer.emit();
            } else {
              this.message.error("Failed to Create Account", '');
            }
          },
          error: () => {
            this.message.error("Failed to Create Account", '');
          }
        });
      } else {
        this.message.error("Unable to create account.", '');
      }
    } catch (e) {
      this.isConfirmingAccount = false;
      this.message.error("Error creating account in CBS", '');
    }
  }

  async completeVerifier() {

    let send_to_refill = false

    for (let tab of this.Tabs) {
      if (tab.SEND_TO_REFILL) {
        send_to_refill = true;
        break;
      }
    }

    let isOk = true;

    if (!this.remarkComp.REMARK) {
      this.message.error("Remark is mendetory field", '');
      isOk = false;
    }

    if (send_to_refill && isOk) {
      this.personalComp.basicInfo.TRACK_ID = 1;
      let personal = this.personalComp.save();
      // this.personalComp.basicInfo.STATUS = 'D';
      personal.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.saveRemark();
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

    else if (isOk) {
      this.AccountCreationStatus.emit(true);

      const applicantId = this.personalComp?.basicInfo?.ID || this.BasicInfo?.ID;
      if (!applicantId) {
        this.message.error("Applicant ID missing", '');
        this.AccountCreationStatus.emit(false);
        return;
      }

      if (this.isTestMode) {
        try {
          let testResult = await lastValueFrom(this.api.onBoardCustomer(applicantId, true));
          this.AccountCreationStatus.emit(false);

          if (testResult && testResult['code'] == 200) {
            this.testJsonPayloadString = JSON.stringify(testResult['data'], null, 2);
            this.isTestModalVisible = true;
            this.message.info("Test Mode: JSON Payload generated. Please review and click Confirm to create account.", '');
          } else {
            this.message.error("Failed to generate JSON payload in Test Mode.", '');
          }
        } catch (e) {
          this.AccountCreationStatus.emit(false);
          this.message.error("Error generating test mode payload", '');
        }
        return;
      }

      let onBoardingResult: any;
      try {
        onBoardingResult = await lastValueFrom(this.api.onBoardCustomer(applicantId, false));
      } catch (err: any) {
        this.message.error(err.error?.message || "Failed to create account due to server error.", '');
        this.AccountCreationStatus.emit(false);
        return;
      }

      if (onBoardingResult && onBoardingResult['code'] == 200) {
        this.message.success("customer created. ", `Customer ID = ${onBoardingResult.success_data['Customer Code']}`);
        this.AccountCreationStatus.emit(false);

        this.personalComp.basicInfo.TRACK_ID = 4;
        let personal = this.personalComp.save();
        // this.personalComp.basicInfo.STATUS = 'V'; do not remove comment of this line.
        personal.subscribe({
          next: (res: any) => {
            if (res.code == 200) {
              this.saveRemark();
              this.message.success("Account has been created", `Account Number = ${onBoardingResult.success_data['Account number']}`)
              this.CloseDrawer.emit();
            }
            else {
              this.message.error("Failed to Create Account", '');
            }
          }, error: () => {
            this.message.error("Failed to Create Account", '');
          },
          complete: () => {

          }
        })

      }

      else {
        this.message.error(onBoardingResult?.message || "Unable to create account.", '');
        this.AccountCreationStatus.emit(false);
      }


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

    let isOk = true;

    if (!this.remarkComp.REMARK) {
      this.message.error("Remark is mendetory field", '');
      isOk = false;
    }

    if (send_to_refill && isOk) {
      this.personalComp.basicInfo.TRACK_ID = 1;

      let personal = this.personalComp.save();
      // this.personalComp.basicInfo.STATUS = 'D';
      personal.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.saveRemark();
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

    else if (isOk) {
      this.personalComp.basicInfo.TRACK_ID = 3;
      this.personalComp.basicInfo.VERIFIED_DATE_TIME = new Date().toString();
      this.api.getUser({ role_id: 3 }).subscribe({
        next: (res) => {
          if (res['code'] == 200 && res['data'].length > 0) {
            // this.personalComp.basicInfo.VERIFIER_USER_ID = res.data[0].ID;
            let personal = this.personalComp.save();
            personal.subscribe({
              next: (res) => {
                if (res.code == 200) {
                  this.saveRemark();
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
          else {
            this.message.error("Something went wrong", '');
          }
        },
        error: () => {
          this.message.error("Something went wrong", '');
        }
      })

    }
  }


  getTabs(applicant_id: number, track_id?: number) {
    this.api.getTabs(applicant_id, sessionStorage.getItem('ROLE_ID'), track_id).subscribe({
      next: (res) => {
        if (res['code'] && res['data']) {
          this.Tabs = res['data'];
          this.reset();
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

  nextTab_noaction(index: number) {
    this.selectedIndex = index + 1;
    this.changeIndex();
  }

  checkerDisable: boolean = true;
  verifierDisable: boolean = true;

  sendToRefill(index: number, remark: string, user: string) {
    this.Tabs[index].SEND_TO_REFILL_COUNT++;
    this.Tabs[index].SEND_TO_REFILL = true;
    this.Tabs[index].REFILL_BY = Number(sessionStorage.getItem('ROLE_ID'));

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
            this.applicantDetail.basicInfo = this.BasicInfo;
            this.Tabs[3].disabled = true;
            this.Tabs[4].disabled = false;
            this.selectedIndex++;
            this.changeIndex();
          }

          else if (this.selectedIndex == 4) {
            this.Tabs[4].disabled = true;
            this.Tabs[5].disabled = false;
            this.remarkComp.Tabs = this.Tabs.filter(value => value.INDEX != 5);
            this.remarkComp.APPLICAT_ID = this.APPLICANT_ID;
            this.remarkComp.show_remark = true;
            this.remarkComp.getRemarkData();
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
            this.applicantDetail.basicInfo = this.BasicInfo;
            this.Tabs[3].disabled = true;
            this.Tabs[4].disabled = false;
            this.selectedIndex++;
            this.changeIndex();
          }

          else if (this.selectedIndex == 4) {
            this.Tabs[4].disabled = true;
            this.Tabs[5].disabled = false;
            this.remarkComp.Tabs = this.Tabs.filter(value => value.INDEX != 5);
            this.remarkComp.APPLICAT_ID = this.APPLICANT_ID;
            this.remarkComp.show_remark = true;
            this.remarkComp.getRemarkData();
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


  async saveANext() {
    this.loadSaveButton = true;
    try {
      if (this.selectedIndex == 0) {
        await new Promise<void>((resolve, reject) => {
          let personal = this.personalComp.save();
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
                resolve();
              } else {
                this.loadSaveButton = false;
                resolve();
              }
            }, error: (err) => {
              this.loadSaveButton = false;
              reject(err);
            },
            complete: () => {
              this.loadSaveButton = false;
              resolve();
            }
          })
        });
      }
      else if (this.selectedIndex == 1) {
        this.depositeComp.depositInfo.APPLICANT_ID = this.APPLICANT_ID;
        await new Promise<void>((resolve, reject) => {
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
                resolve();
              } else {
                this.loadSaveButton = false;
                resolve();
              }
            },
            error: (err) => {
              this.loadSaveButton = false;
              reject(err);
            },
            complete: () => {
              this.loadSaveButton = false;
              resolve();
            }
          })
        });
      }
      else if (this.selectedIndex == 2) {
        await new Promise<void>((resolve, reject) => {
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
                resolve();
              } else {
                this.loadSaveButton = false;
                resolve();
              }
            }, error: (err) => {
              this.loadSaveButton = false;
              reject(err);
            },
            complete: () => {
              this.loadSaveButton = false;
              resolve();
            }
          })
        });
      }

      else if (this.selectedIndex == 3) {
        this.serviceComp.serviceInfo.APPLICANT_ID = this.APPLICANT_ID;
        await new Promise<void>((resolve, reject) => {
          let service = this.serviceComp.save();
          service.subscribe({
            next: (res) => {
              if (res.code == 200) {
                this.Tabs[3].disabled = true;
                this.Tabs[4].disabled = false;
                this.updateTabsProvided(this.selectedIndex);
                this.applicantDetail.APPLICANT_ID = this.APPLICANT_ID;
                this.applicantDetail.getAllApplicant();
                this.applicantDetail.basicInfo = this.BasicInfo;
                this.loadSaveButton = false;
                resolve();
              } else {
                this.loadSaveButton = false;
                resolve();
              }
            }, error: (err) => {
              this.loadSaveButton = false;
              reject(err);
            },
            complete: () => {
              this.loadSaveButton = false;
              resolve();
            }
          })
        });
      }
      else if (this.selectedIndex == 4) {
        let res = await lastValueFrom(this.api.getProperty(this.APPLICANT_ID, 1));
        if (res['data'].length > 0) {
          this.Tabs[4].disabled = true;
          this.Tabs[5].disabled = false;
          this.updateTabsProvided(this.selectedIndex);
          this.remarkComp.Tabs = this.Tabs.filter(value => value.INDEX != 5);
          this.remarkComp.APPLICAT_ID = this.APPLICANT_ID;
          this.remarkComp.show_remark = true;
          this.remarkComp.getRemarkData();
          this.loadSaveButton = false;
        }
        else {
          this.message.error("Fill all the information", "Personal, Financial and Property")
          this.loadSaveButton = false;
        }
      }
      else if (this.selectedIndex == 5) {
        this.saveAsComplete();
        this.loadSaveButton = false;
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.loadSaveButton = false;
    }
  }

  previous() {

    this.loadPreviousButton = true;

    if (this.selectedIndex == 5) {
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

  saveRemark() {
    let _REMARK_: RemarkModel = new RemarkModel();
    _REMARK_.APPLICANT_ID = this.APPLICANT_ID;
    _REMARK_.REMARK_DATE = new Date().toString();
    _REMARK_.USER_ID = Number(sessionStorage.getItem('USER_ID'));
    _REMARK_.REMARK = this.remarkComp.REMARK;

    this.api.getUserRole(Number(sessionStorage.getItem('ROLE_ID'))).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          _REMARK_.ROLE = res['data'][0]['NAME']
          this.api.getUser({ user_id: _REMARK_.USER_ID }).subscribe({
            next: (result) => {
              if (result['code'] == 200 && result['data'].length > 0) {
                _REMARK_.USER_NAME = result['data'][0]['NAME']
                this.remarkComp.createRemark(_REMARK_);
              }
            }
          })

        }
      }
    })

  }

  saveAsComplete() {

    let isOk = true;

    if (!this.remarkComp.REMARK) {
      this.message.error("Remark is mendetory field", '');
      isOk = false;
    }

    if (isOk) {
      this.personalComp.basicInfo.TRACK_ID = 2;
      this.personalComp.basicInfo.FILLED_DATE_TIME = new Date().toString();
      this.api.getUser({ role_id: 2, branch_id: this.personalComp.basicInfo.CREATED_BRANCH_ID }).subscribe({
        next: (res) => {
          if (res.code == 200 && res.data.length > 0) {
            this.personalComp.basicInfo.CHACKER_USER_ID = res.data[0].ID;
            this.saveRemark();
            let personal = this.personalComp.save();
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
          else {
            this.message.error("Something went wrong", '');
          }
        },
        error: () => {
          this.message.error("Something went wrong", '');
        }
      })
    }


  }

  next() {
    this.loadSaveButton = true;

    if (this.selectedIndex == 0) {
      this.APPLICANT_ID = this.BasicInfo.ID;
      this.depositeComp.APPLICANT_ID = this.APPLICANT_ID;
      this.depositeComp.getDepositInfo();
      this.Tabs[0].disabled = true;
      this.Tabs[1].disabled = false;
      this.nextTab_noaction(this.selectedIndex);
      this.loadSaveButton = false;

    }
    else if (this.selectedIndex == 1) {
      this.depositeComp.depositInfo.APPLICANT_ID = this.APPLICANT_ID;
      this.nomineeComp.APPLICANT_ID = this.APPLICANT_ID;
      this.nomineeComp.getNominationInfo();
      this.Tabs[1].disabled = true;
      this.Tabs[2].disabled = false;
      this.nextTab_noaction(this.selectedIndex);
      this.loadSaveButton = false;

    }
    else if (this.selectedIndex == 2) {
      this.serviceComp.APPLICANT_ID = this.APPLICANT_ID;
      this.serviceComp.getServiceInfo();
      this.Tabs[2].disabled = true;
      this.Tabs[3].disabled = false;
      this.nextTab_noaction(this.selectedIndex);
      this.loadSaveButton = false;

    }

    else if (this.selectedIndex == 3) {

      this.serviceComp.serviceInfo.APPLICANT_ID = this.APPLICANT_ID;
      this.Tabs[3].disabled = true;
      this.Tabs[4].disabled = false;
      this.applicantDetail.APPLICANT_ID = this.APPLICANT_ID;
      this.applicantDetail.getAllApplicant();
      this.applicantDetail.basicInfo = this.BasicInfo;
      this.nextTab_noaction(this.selectedIndex);
      this.loadSaveButton = false;

    }
    else if (this.selectedIndex == 4) {
      this.Tabs[4].disabled = true;
      this.Tabs[5].disabled = false;
      this.remarkComp.Tabs = this.Tabs.filter(value => value.INDEX != 5);
      this.remarkComp.APPLICAT_ID = this.APPLICANT_ID;
      this.remarkComp.show_remark = false;
      this.remarkComp.getRemarkData();
      this.nextTab_noaction(this.selectedIndex);
      this.loadSaveButton = false;

    }

    else if (this.selectedIndex == 5) {
      this.CloseDrawer.emit();
    }

  }

}
