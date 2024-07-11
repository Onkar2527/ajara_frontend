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
    let basic = this.basicComp.save();
    basic.subscribe({
      next: (res) => {
        if (res.code == 200) {
          this.loadSaveButton = false;
          this.drawerReferance.close();
        }
        else if (res.code == 300) {
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

  getDrafts() {
    this.TableLoading = true;
    // let User_id = sessionStorage.getItem('lk0oh6fdb4567');
    console.log("In Draft Function");

    let user_data = SessionUserDetails.getSessionStorage();

    this.api.getDraft(this.pageSize, this.pageIndex, user_data).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
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
    "Applicant Photo"
  ]

  saveANext() {
    if (this.selectedIndex != 5) {
      this.addAccountComp.saveANext();
    }
    else {
      this.api.getDocument(this.APPLICANT_ID, null).subscribe({
        next: (res) => {
          if (res['code'] == 200) {
            if (res['data'].length >= 3) {
              this.velidateDocument(res['data']) ? this.addAccountComp.saveANext() : this.message.error(`Please Upload ${this.mendetoryDocs[0]}, ${this.mendetoryDocs[1]} and ${this.mendetoryDocs[2]}`, '');
            }
            else {
              this.message.error(`Please Upload ${this.mendetoryDocs[0]}, ${this.mendetoryDocs[1]} and ${this.mendetoryDocs[2]}`, '');
            }
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

  }

  velidateDocument(docArray: Documents[]) {
    let count = 0
    for (let doc of docArray) {
      if (this.mendetoryDocs.includes(doc.DOCUMENT_NAME)) {
        if (doc.IMAGE_DATA) count++;
      }
    }

    if (count >= this.mendetoryDocs.length) {
      return true;
    }
    else {
      return false;
    }
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
    let ok = true;

    if (role == 'C')
      for (let doc of docArray) {
        if (doc.IMAGE_DATA)
          if (!doc.IS_APPROVED_CHECKER) {
            ok = false
          }
      }


    if (role == 'V')
      for (let doc of docArray) {
        if (doc.IMAGE_DATA)
          if (!doc.IS_APPROVED_VERIFIER) {
            ok = false
          }
      }

    return ok
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


    let width = window.screen.availWidth;

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



}
