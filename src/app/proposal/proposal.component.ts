import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AddAccountComponent } from '../add-account/add-account/add-account.component';
import { FormComponent } from '../add-account/form/form.component';
import { PersonalComponent } from '../add-account/personal/personal.component';
import { BasicInfo } from '../models/basicInfo';
import { ApiService } from '../service/api.service';
import { ExtraInfo } from '../models/extra-info';
import { Documents } from '../models/documents';
import { SessionUserDetails } from '../common_modules/session_storage/SessionUserDetails';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { EditStatusComponent } from '../admin-panel/proposal-master/edit-status/edit-status.component';
import { TermDeposite } from '../models/term-deposite';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {

  @ViewChild(AddAccountComponent) addAccountComp!: AddAccountComponent;
  @ViewChild(PersonalComponent) basicComp !: PersonalComponent;
  @ViewChild(FormComponent) formComp !: FormComponent;

  @ViewChild('drawerTemplate', { static: false }) drawerTemplate?: TemplateRef<{
    $implicit: {};
    drawerRef: NzDrawerRef<any>;
  }>;

  @ViewChild('addAccountDrawerTemp', { static: false }) addAccountDrawerTemp?: TemplateRef<{
    $implicit: {};
    drawerRef: NzDrawerRef<any>;
  }>;

  @ViewChild('formDrawerTemp', { static: false }) formDrawerTemp?: TemplateRef<{
    $implicit: {};
    drawerRef: NzDrawerRef<any>;
  }>;

  @ViewChild('docDrawerTemp', { static: false }) docDrawerTemp?: TemplateRef<{
    $implicit: {};
    drawerRef: NzDrawerRef<any>;
  }>;

  @ViewChild('footerTpl', { static: false }) basicFooterTemplate?: TemplateRef<{}>;
  @ViewChild('footerTpl2', { static: false }) TabFooterTemplate?: TemplateRef<{}>;
  @ViewChild('footerTpl3', { static: false }) FormFooterTemplate?: TemplateRef<{}>;
  @ViewChild('footerTpl4', { static: false }) DocFooterTemplate?: TemplateRef<{}>;
  @ViewChild('noActionTpl', { static: false }) noActionFooter?: TemplateRef<{}>;


  @ViewChild('TabFooterTplChecker', { static: false }) TabFooterTplChecker?: TemplateRef<{}>;

  @ViewChild('tabHeaderTamplete', { static: false }) TabHeaderTemplate?: TemplateRef<{}>;

  @ViewChild('tabHeaderVerifierTamplete', { static: false }) tabHeaderVerifierTamplete?: TemplateRef<{}>;

  @ViewChild('tabHeaderMakerTamplete', { static: false }) tabHeaderMakerTamplete?: TemplateRef<{}>;

  @ViewChild('TabFooterTplVerifier', { static: false }) TabFooterTplVerifier?: TemplateRef<{}>;

  constructor(private api: ApiService, private message: NzNotificationService, private drawerService: NzDrawerService, private modal: NzModalService) { }

  ROLE_ID!: number;

  popover_visible: boolean = false;

  BRANCH_LIST: any = [];

  cpcFilter: CpcFilter = new CpcFilter()
  dateRange: Date[] = [];

  ngOnInit(): void {
    this.getDrafts();
    this.getUser();
  }
  Tabs: ExtraInfo[] = []
  userDetails: any;

  STATUS_LIST: any = []

  depositeInfo: TermDeposite[] = []

  accountCreateButtonLoading = false;

  accountCreationEvent(status: boolean) {
    this.accountCreateButtonLoading = status;
  }

  getDepositeInfo() {
    this.depositeInfo = []
    for (let proposal of this.DraftsData) {
      this.api.getDeposite(proposal.ID).subscribe({
        next: (res) => {
          if (res['code'] == 200 && res['data'].length > 0) {
            this.depositeInfo.push(res['data'][0]);
          }
        }
      })
    }
  }

  getAccountType(id: 'A'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F'
    | 'G'
    | 'H') {
    let account_types = {
      'A': 'Saving',
      'B': 'Janata Deposite',
      'C': 'Current Account',
      'D': 'Fixed Deposit',
      'E': 'Fixed Deposit (Reinvestment)',
      'F': 'Recurring Deposit',
      'G': 'Pigmy Deposit',
      'H': 'Other'
    }

    return account_types[id];
  }

  getTabs(applicant_id: number, track_id?: number) {
    this.api.getTabs(applicant_id, sessionStorage.getItem('ROLE_ID'), track_id).subscribe({
      next: (res) => {
        if (res['code'] && res['data']) {
          this.Tabs = res['data'];
          console.log("tabs = ", this.Tabs);
        }
      }
    })
  }



  getUser() {
    this.ROLE_ID = Number(sessionStorage.getItem('ROLE_ID'));
    this.userDetails = SessionUserDetails.getSessionStorage();
  }


  drawerReferance: any

  TableLoading = false;

  DraftsData: any = []

  drawerDraftData: BasicInfo = new BasicInfo;

  pageIndex = 1;
  pageSize = 10;
  dataCount!: number;

  header: any;
  footer: any;
  title: string = '';


  openTabsDrawer(data: BasicInfo) {

    this.getTabs(data.ID, data.TRACK_ID);

    this.APPLICANT_ID = data.ID;
    console.log("APPLICANT_ID", this.APPLICANT_ID);

    let role_id = Number(sessionStorage.getItem('ROLE_ID'))

    this.title = this.getStatusName(data.TRACK_ID);

    if (role_id == 1 && data.TRACK_ID == 1) {
      this.header = this.tabHeaderMakerTamplete;
      this.footer = this.TabFooterTemplate;
    }

    else if (role_id == 1 && data.TRACK_ID != 1) {
      this.footer = this.noActionFooter;
    }

    else if (role_id == 2 && data.TRACK_ID != 2) {
      this.footer = this.noActionFooter;
    }

    else if (role_id == 3 && data.TRACK_ID != 3) {
      this.footer = this.noActionFooter;
    }

    else if (role_id == 2 && data.TRACK_ID == 2) {
      this.header = this.TabHeaderTemplate;
      this.footer = this.TabFooterTplChecker;
    }

    else if (role_id == 3 && data.TRACK_ID == 3) {
      this.header = this.tabHeaderVerifierTamplete;
      this.footer = this.TabFooterTplVerifier;
      this.title = 'Verify All Information';
    }

    else {
      this.footer = this.noActionFooter;
    }




    this.drawerDraftData = data;

    // const drawerRef = this.drawerService.create({
    //   nzTitle: this.title,
    //   nzFooter: this.footer,
    //   nzContent: this.addAccountDrawerTemp,
    //   nzExtra: this.header,
    //   nzWidth: 1095,

    // });

    this.openDrawer(this.title, this.footer, this.addAccountDrawerTemp, this.tabClose, this.header)


    // this.drawerReferance = drawerRef;

    // drawerRef.afterOpen.subscribe(() => {
    //   console.log('Drawer(Template) open');
    // });

    // drawerRef.afterClose.subscribe(() => {
    //   console.log('Drawer(Template) close');

    // });
  }

  tabClose() {
    this.selectedIndex = 0;
    this.getDrafts();
  }


  changeTabStatus(event: any) {
    console.log('sendToRefillSwitchStatus', this.Tabs[this.selectedIndex].SEND_TO_REFILL);
  }

  loadSaveButton: boolean = false;

  sendTorefill(user: string) {
    let remark = ''
    if (user == 'C') {
      remark = this.Tabs[this.selectedIndex].CHECKER_REMARK;
    }
    if (user == 'V') {
      remark = this.Tabs[this.selectedIndex].VERIFIER_REMARK;
    }
    this.addAccountComp.sendToRefill(this.selectedIndex, remark, user);
  }

  Accept(user: string) {
    this.addAccountComp.Accept(this.selectedIndex, user);
  }

  completeChecker() {
    this.validateDocs('C');
  }

  completeVerifier() {
    this.validateDocs('V');
  }

  openBasicDrawer() {
    // const drawerRef = this.drawerService.create({
    //   nzTitle: ,
    //   nzFooter: ,
    //   nzContent: ,
    //   nzWidth: 1095
    // });

    this.openDrawer("New Account", this.basicFooterTemplate, this.drawerTemplate, this.getDrafts)



    // drawerRef.afterOpen.subscribe(() => {
    //   console.log('Drawer(Template) open');
    // });

    // drawerRef.afterClose.subscribe(() => {
    //   console.log('Drawer(Template) close');
    //   this.getDrafts();
    // });

  }

  createProposal() {
    this.loadSaveButton = true;
    try {
      let basic = this.basicComp.save();
      basic.subscribe({
        next: (res) => {
          if (res.code == 200) {
            this.loadSaveButton = false;
            this.drawerReferance.close();
          }
          else {
            this.loadSaveButton = false;
          }
        }, error: () => {
          this.loadSaveButton = false;
        },
        complete: () => {
          this.loadSaveButton = false;
        }
      });
    } catch (err) {
      console.error(err);
      this.loadSaveButton = false;
    }
  }

  getDrafts() {
    this.TableLoading = true;
    // let User_id = sessionStorage.getItem('lk0oh6fdb4567');
    console.log("In Draft Function");

    let user_data = SessionUserDetails.getSessionStorage();

    if (this.dateRange.length > 0) {
      this.cpcFilter.START_DATE = this.dateRange[0].toISOString().split('T')[0];
      this.cpcFilter.END_DATE = this.dateRange[1].toISOString().split('T')[0];
    } else {
      this.cpcFilter.START_DATE = '';
      this.cpcFilter.END_DATE = '';
    }

    this.api.getDraft(this.pageSize, this.pageIndex, user_data, this.cpcFilter).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          console.log("res['data']", res['data'])
          this.DraftsData = res['data'];
          this.getDepositeInfo()
          this.dataCount = res['count'];
          console.log("res['data']", res['data'])
          this.TableLoading = false;
          console.log("this.TableLoading", this.TableLoading)
          this.getStatusList();
          this.getBranchList();
        }
        else {
          this.TableLoading = false;
        }
      },
      error: (err) => {
        this.TableLoading = false;
      },
      complete: () => {
        this.TableLoading = false;
      }
    })
  }

  getStatusList() {
    this.api.getStatusList().subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.STATUS_LIST = res['data'];
        }
      }
    })
  }

  getStatusName(track_id?: number) {
    if (!track_id)
      return ''

    let our_status = this.STATUS_LIST.filter((value: any) => {
      return value.ID == track_id
    });

    if (our_status.length > 0) {
      return our_status[0].NAME ? our_status[0].NAME : ''
    }
    else {
      return '';
    }


  }

  getBranchList() {
    this.api.getAllBranch().subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.BRANCH_LIST = res['data'];
        }
      }
    })
  }

  getBranchName(branch_id?: number) {
    if (!branch_id)
      return ''

    let our_branch = this.BRANCH_LIST.filter((value: any) => {
      return value.ID == branch_id
    });

    if (our_branch.length > 0) {
      return our_branch[0].BRANCH_NAME ? our_branch[0].BRANCH_NAME : ''
    }
    else {
      return '';
    }


  }

  selectedIndex = 0;
  verifyButtonTitle = ''
  changeIndex(event: any) {
    console.log(event);
    this.selectedIndex = event;
    if (this.selectedIndex >= 5) {
      this.header = '';


      let send_to_refill = false

      for (let tab of this.Tabs) {
        if (tab.SEND_TO_REFILL) {
          send_to_refill = true;
          break;
        }
      }

      if (send_to_refill) {
        this.verifyButtonTitle = 'Send to refill'
      }
      else {
        this.verifyButtonTitle = 'Send to next Stage'
      }

    }
  }

  closeDrawer() {
    this.drawerReferance.close();
  }

  previous() {
    this.addAccountComp.previous();
    this.selectedIndex = this.addAccountComp.selectedIndex;
  }

  mendetoryDocs = [
    "Applicant ID Proof",
    "Applicant Address Proof",
    "Applicant Photo",
    "Signature"
  ]

  async saveANext() {
    this.loadSaveButton = true;
    try {
      if (this.selectedIndex != 5) {
        await this.addAccountComp.saveANext();
      }
      else {
        const totalApplicants = (this.drawerDraftData && this.drawerDraftData.NO_OF_APPLICANT) || (this.basicInfo && this.basicInfo.NO_OF_APPLICANT) || 1;
        const requiredDocCount = totalApplicants * 4;
        await new Promise<void>((resolve, reject) => {
          this.api.getDocument(this.APPLICANT_ID, null).subscribe({
            next: async (res) => {
              try {
                if (res['code'] == 200) {
                  if (res['data'].length >= requiredDocCount) {
                    if (this.velidateDocument(res['data'])) {
                      await this.addAccountComp.saveANext();
                    } else {
                      this.message.error('Please Upload ID Proof, Address Proof, Photo, and Sign for all applicants.', '');
                    }
                  }
                  else {
                    this.message.error('Please Upload ID Proof, Address Proof, Photo, and Sign for all applicants.', '');
                  }
                }
                else {
                  this.message.error("Something Went Wrong!", "")
                }
                resolve();
              } catch (e) {
                reject(e);
              }
            },
            error: (err) => {
              this.message.error("Something Went Wrong!", "")
              reject(err);
            }
          })
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.loadSaveButton = false;
    }
  }

  velidateDocument(docArray: Documents[]) {
    const totalApplicants = (this.drawerDraftData && this.drawerDraftData.NO_OF_APPLICANT) || (this.basicInfo && this.basicInfo.NO_OF_APPLICANT) || 1;

    for (let appNo = 1; appNo <= totalApplicants; appNo++) {
      const appDocs = docArray.filter(doc => doc.APPLICANT_NO == appNo);
      
      let hasId = false;
      let hasAddress = false;
      let hasPhoto = false;
      let hasSign = false;

      for (let doc of appDocs) {
        if (doc.IMAGE_DATA) {
          if (doc.DOCUMENT_NAME === "Applicant ID Proof") hasId = true;
          if (doc.DOCUMENT_NAME === "Applicant Address Proof") hasAddress = true;
          if (doc.DOCUMENT_NAME === "Applicant Photo") hasPhoto = true;
          if (doc.DOCUMENT_NAME === "Signature" || doc.DOCUMENT_NAME === "Sign") hasSign = true;
        }
      }

      if (!hasId || !hasAddress || !hasPhoto || !hasSign) {
        return false;
      }
    }

    return true;
  }

  APPLICANT_ID!: number;

  openFormDrawer(data: BasicInfo) {

    this.APPLICANT_ID = data.ID;
    console.log("APPLICANT_ID", this.APPLICANT_ID);

    // const drawerRef = this.drawerService.create({
    //   nzTitle: "Form",
    //   nzFooter: this.FormFooterTemplate,
    //   nzContent: this.formDrawerTemp,
    //   nzWidth: 1095
    // });

    this.openDrawer("Form", this.FormFooterTemplate, this.formDrawerTemp, this.getDrafts)

    // this.drawerReferance = drawerRef;

    // drawerRef.afterOpen.subscribe(() => {
    //   console.log('Drawer(Template) open');
    // });

    // drawerRef.afterClose.subscribe(() => {
    //   console.log('Drawer(Template) close');
    //   this.getDrafts();
    // });

  }

  loadPdfButton: boolean = false;

  downloadPDF() {
    this.loadPdfButton = true;
    this.formComp.save();
  }

  pdfLoading(event: boolean) {
    this.loadPdfButton = event;
  }

  basicInfo: BasicInfo = new BasicInfo();
  openUploadDrawer(data: BasicInfo) {
    this.APPLICANT_ID = data.ID;
    this.basicInfo = data;
    // const drawerRef = this.drawerService.create({
    //   nzTitle: "Document",
    //   nzFooter: this.DocFooterTemplate,
    //   nzContent: this.docDrawerTemp,
    //   nzWidth: 1095
    // });

    this.openDrawer("Document", this.DocFooterTemplate, this.docDrawerTemp, this.getDrafts)

    // this.drawerReferance = drawerRef;

    // drawerRef.afterOpen.subscribe(() => {
    //   console.log('Drawer(Template) open');

    // });

    // drawerRef.afterClose.subscribe(() => {
    //   console.log('Drawer(Template) close');
    //   this.basicInfo = new BasicInfo();
    //   this.getDrafts();
    // });
  }


  saveUploadDrawer() {
    this.drawerReferance.close();
  }

  next() {

    this.addAccountComp.next()


  }

  validateDocs(type: 'C' | 'V') {

    this.api.getDocument(this.APPLICANT_ID, null).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          if (type == 'C')
            this.velidateDocChacker(res['data'], type) ? this.addAccountComp.completeChecker() : this.message.error("Verify All Documents first", '');

          if (type == 'V')
            this.velidateDocChacker(res['data'], type) ? this.addAccountComp.completeVerifier() : this.message.error("Verify All Documents first", '');
        }
        else {
          this.message.error("Something Went Wrong!", "")
        }
      },
      error: (err) => {
        this.message.error("Something Went Wrong!", "")
      }
    })

  }

  velidateDocChacker(docArray: Documents[], role: 'C' | 'V') {
    const totalApplicants = (this.drawerDraftData && this.drawerDraftData.NO_OF_APPLICANT) || (this.basicInfo && this.basicInfo.NO_OF_APPLICANT) || 1;

    for (let appNo = 1; appNo <= totalApplicants; appNo++) {
      const appDocs = docArray.filter(doc => doc.APPLICANT_NO == appNo);
      
      let hasId = false;
      let hasAddress = false;
      let hasPhoto = false;
      let hasSign = false;

      for (let doc of appDocs) {
        if (doc.IMAGE_DATA) {
          if (doc.DOCUMENT_NAME === "Applicant ID Proof") {
            if (role == 'C' && !doc.IS_APPROVED_CHECKER) return false;
            if (role == 'V' && !doc.IS_APPROVED_VERIFIER) return false;
            hasId = true;
          }
          else if (doc.DOCUMENT_NAME === "Applicant Address Proof") {
            if (role == 'C' && !doc.IS_APPROVED_CHECKER) return false;
            if (role == 'V' && !doc.IS_APPROVED_VERIFIER) return false;
            hasAddress = true;
          }
          else if (doc.DOCUMENT_NAME === "Applicant Photo") {
            if (role == 'C' && !doc.IS_APPROVED_CHECKER) return false;
            if (role == 'V' && !doc.IS_APPROVED_VERIFIER) return false;
            hasPhoto = true;
          }
          else if (doc.DOCUMENT_NAME === "Signature" || doc.DOCUMENT_NAME === "Sign") {
            if (role == 'C' && !doc.IS_APPROVED_CHECKER) return false;
            if (role == 'V' && !doc.IS_APPROVED_VERIFIER) return false;
            hasSign = true;
          }
          else {
            // For other uploaded non-mandatory documents, they must also be approved
            if (role == 'C' && !doc.IS_APPROVED_CHECKER) return false;
            if (role == 'V' && !doc.IS_APPROVED_VERIFIER) return false;
          }
        }
      }

      if (!hasId || !hasAddress || !hasPhoto || !hasSign) {
        return false;
      }
    }

    return true;
  }

  @ViewChild('editStatus', { static: false }) editStatus?: TemplateRef<{
    $implicit: {};
    drawerRef: NzModalRef<any>;
  }>;

  @ViewChild(EditStatusComponent) editStatusComp!: EditStatusComponent;

  editStatusFn(proposal: BasicInfo) {
    this.STATUS_LIST
    const modalRef = this.modal.create({
      nzTitle: 'Edit Status',
      nzContent: this.editStatus,
      // nzFooter: tplFooter,
      nzMaskClosable: true,
      nzClosable: true,
      nzOnOk: () => {
        this.editStatusComp.save();
      }
    });

    modalRef.afterOpen.subscribe(() => {
      this.editStatusComp.STATUS_LIST = this.STATUS_LIST;
      Object.assign(this.editStatusComp.basicInfo, proposal);
    })

    modalRef.afterClose.subscribe(() => {
      this.getDrafts();
    })

  }

  openDrawer(title: string, footer: any, content: any, close_back: any, extra?: any) {


    let width = window.innerWidth;

    const drawerRef = this.drawerService.create({
      nzTitle: title,
      nzFooter: footer,
      nzContent: content,
      nzWidth: width,
      nzExtra: extra
    });
    this.drawerReferance = drawerRef;
    drawerRef.afterClose.subscribe(() => {
      this.selectedIndex = 0;
      this.getDrafts();
    })
  }

  pick(proposal: BasicInfo) {
    proposal.VERIFIER_USER_ID = this.userDetails.USER_ID;

    this.api.updateBasic(proposal).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.message.success("Proposal Picked", "");
          this.getDrafts();
        }
        else {
          this.message.error("Failed to pick proposal", "");
        }
      },
      error: () => {
        this.message.error("Failed to pick proposal", "");
      }
    })
  }

  unpick(proposal: BasicInfo) {
    proposal.VERIFIER_USER_ID = null;

    this.api.updateBasic(proposal).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.message.success("Proposal re assigned", "");
          this.getDrafts();
        }
        else {
          this.message.error("Failed to re assigned proposal", "");
        }
      },
      error: () => {
        this.message.error("Failed to re assigned proposal", "");
      }
    })
  }


  applyFilter() {
    this.getDrafts();
  }

  clearFilter() {
    this.cpcFilter = new CpcFilter();
    this.dateRange = [];
    this.getDrafts();
  }


  downloadExcel() {

    let xlsx_template = [
      { key: ["", "", ""], header: "Applicant Name" },
      { key: ["ACCOUNT_NUMBER"], header: "" },
      { key: ["CUSTOMER_ID_1"], header: "" },
      { key: ["AADHAAR_NO_1"], header: "" },
      { key: ["IS_AADHAAR_DBT"], header: "" }
    ]

    let xlsx_data = []
    let data = <any>{}

    for (let proposal of this.DraftsData) {
      data = {};
      let fullName = `${proposal.PRIMARY_APPLICANT_FIRST_NAME} ${proposal.PRIMARY_APPLICANT_MIDDLE_NAME} ${proposal.PRIMARY_APPLICANT_LAST_NAME}`
      data["Applicant Name"] = fullName;
      data["Account Number"] = proposal.ACCOUNT_NUMBER;
      data["Customer ID"] = proposal.CUSTOMER_ID_1;
      data["Aadhaar Number"] = proposal.AADHAAR_NO_1;
      data["DBT (Direct Benefit Transfer) Required"] = proposal.IS_AADHAAR_DBT ? "Yes" : "No";
      // for (let temp of xlsx_template) {
      //   let header = temp.header;

      //   for (let key of temp.key) {
      //     console.log("Key", key, proposal[key])
      //     if (key == 'IS_AADHAAR_DBT') {
      //       data[header] = proposal[key] == 'Y' ? 'Yes' : 'No';
      //     }
      //     if (data[header] == 'Applicant Name') {
      //       data[header] += ` ${proposal[key]}`
      //     }

      //   }

      //   // if (header == 'Branch' || header == 'Department') {
      //   //   proposal[header] = proposal[temp.key].name;
      //   // }
      //   // else {
      //   //   proposal[header] = proposal[temp.key];
      //   // }

      // }

      xlsx_data.push(data);
    }

    console.log("Data", xlsx_data);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(xlsx_data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, "Applicant List.xlsx");
  }


}


class CpcFilter {
  BRANCH_ID: number = 0;
  TRACK_ID: number = 0;
  START_DATE: string = '';
  END_DATE: string = '';
  IS_AADHAAR_DBT: any = 0;
}
