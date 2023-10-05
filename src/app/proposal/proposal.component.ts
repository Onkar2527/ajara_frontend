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


  @ViewChild('TabFooterTplChecker', { static: false }) TabFooterTplChecker?: TemplateRef<{}>;

  @ViewChild('tabHeaderTamplete', { static: false }) TabHeaderTemplate?: TemplateRef<{}>;

  @ViewChild('tabHeaderVerifierTamplete', { static: false }) tabHeaderVerifierTamplete?: TemplateRef<{}>;

  @ViewChild('tabHeaderMakerTamplete', { static: false }) tabHeaderMakerTamplete?: TemplateRef<{}>;

  @ViewChild('TabFooterTplVerifier', { static: false }) TabFooterTplVerifier?: TemplateRef<{}>;

  constructor(private api: ApiService, private message: NzNotificationService, private drawerService: NzDrawerService) { }

  ROLE_ID!: number;

  ngOnInit(): void {
    this.getDrafts();
    this.getUser();
  }
  Tabs: ExtraInfo[] = []
  userDetails: any;

  getTabs(applicant_id: number) {
    this.api.getTabs(applicant_id, sessionStorage.getItem('ROLE_ID')).subscribe({
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

    this.getTabs(data.ID);

    if (data.STATUS == 'C') {
      this.header = this.TabHeaderTemplate;
      this.footer = this.TabFooterTplChecker;
      this.title = 'Check All Information';
    }
    else if (data.STATUS == 'D') {
      this.header = this.tabHeaderMakerTamplete;
      this.footer = this.TabFooterTemplate;
      this.title = 'Fill All Information';
    }

    else if (data.STATUS == 'V') {
      this.header = this.tabHeaderVerifierTamplete;
      this.footer = this.TabFooterTplVerifier;
      this.title = 'Verify All Information';
    }


    this.drawerDraftData = data;

    const drawerRef = this.drawerService.create({
      nzTitle: "Fill All Info",
      nzFooter: this.footer,
      nzContent: this.addAccountDrawerTemp,
      nzExtra: this.header,
      nzWidth: 1095,

    });



    this.drawerReferance = drawerRef;

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Template) open');
    });

    drawerRef.afterClose.subscribe(() => {
      console.log('Drawer(Template) close');
      this.selectedIndex = 0;
      this.getDrafts();
    });
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
    this.addAccountComp.completeChecker();
  }

  completeVerifier() {
    this.addAccountComp.completeVerifier();
  }
  openBasicDrawer() {
    const drawerRef = this.drawerService.create({
      nzTitle: "New Account",
      nzFooter: this.basicFooterTemplate,
      nzContent: this.drawerTemplate,
      nzWidth: 1095
    });

    this.drawerReferance = drawerRef;

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Template) open');
    });

    drawerRef.afterClose.subscribe(() => {
      console.log('Drawer(Template) close');
      this.getDrafts();
    });

  }

  createProposal() {
    this.loadSaveButton = true;
    let basic = this.basicComp.save('D');
    basic.subscribe({
      next: (res) => {
        if (res.code == 200) {
          this.loadSaveButton = false;
          this.drawerReferance.close();
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
          this.dataCount = res['count'];
          console.log("res['data']", res['data'])
          this.TableLoading = false;
          console.log("this.TableLoading", this.TableLoading)
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
  saveANext() {
    if (this.selectedIndex != 4) {
      this.addAccountComp.saveANext();
    }
    else {
      this.api.getDocument(this.APPLICANT_ID, null).subscribe({
        next: (res) => {
          if (res['code'] == 200) {
            if (res['data'].length >= 2) {
              this.velidateDocument(res['data']) ? this.addAccountComp.saveANext() : this.message.error("Please Upload Atleast Two Documents!", '');
            }
            else {
              this.message.error("Please Upload Atleast Two Documents!", '');
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
      if (doc.IMAGE_DATA) count++;
    }

    if (count >= 2) {
      return true;
    }
    else {
      return false;
    }
  }


  APPLICANT_ID!: number;

  openFormDrawer(data: BasicInfo) {
    this.APPLICANT_ID = data.ID;
    const drawerRef = this.drawerService.create({
      nzTitle: "Form",
      nzFooter: this.FormFooterTemplate,
      nzContent: this.formDrawerTemp,
      nzWidth: 1095
    });

    this.drawerReferance = drawerRef;

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Template) open');

    });

    drawerRef.afterClose.subscribe(() => {
      console.log('Drawer(Template) close');
      this.getDrafts();
    });

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
    const drawerRef = this.drawerService.create({
      nzTitle: "Document",
      nzFooter: this.DocFooterTemplate,
      nzContent: this.docDrawerTemp,
      nzWidth: 1095
    });

    this.drawerReferance = drawerRef;

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Template) open');

    });

    drawerRef.afterClose.subscribe(() => {
      console.log('Drawer(Template) close');
      this.basicInfo = new BasicInfo();
      this.getDrafts();
    });
  }


  saveUploadDrawer() {
    this.drawerReferance.close();
  }

}
