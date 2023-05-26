import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AddAccountComponent } from '../add-account/add-account/add-account.component';
import { FormComponent } from '../add-account/form/form.component';
import { PersonalComponent } from '../add-account/personal/personal.component';
import { BasicInfo } from '../models/basicInfo';
import { ApiService } from '../service/api.service';

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

  constructor(private api: ApiService, private message: NzNotificationService, private drawerService: NzDrawerService) { }

  ngOnInit(): void {
    this.getDrafts();
  }

  drawerReferance: any

  TableLoading = false;

  DraftsData: any = []

  drawerDraftData: BasicInfo = new BasicInfo;

  pageIndex = 1;
  pageSize = 10;
  dataCount!: number;

  openTabsDrawer(data: BasicInfo) {

    const drawerRef = this.drawerService.create({
      nzTitle: "Fill All Info",
      nzFooter: this.TabFooterTemplate,
      nzContent: this.addAccountDrawerTemp,
      nzWidth: 1095
    });

    this.drawerReferance = drawerRef;

    drawerRef.afterOpen.subscribe(() => {
      this.drawerDraftData = data;
      console.log('Drawer(Template) open');
    });

    drawerRef.afterClose.subscribe(() => {
      console.log('Drawer(Template) close');
      this.selectedIndex = 0;
      this.getDrafts();
    });
  }

  loadSaveButton: boolean = false;


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
    let basic = this.basicComp.save();
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
    this.api.getDraft(this.pageSize, this.pageIndex).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.DraftsData = res['data'];
          this.dataCount = res['count'];
          this.TableLoading = false;
        }
        else {
          this.TableLoading = false;
        }
      },
      error: (err) => {
        this.TableLoading = false;
      }
    })
  }



  selectedIndex = 0;
  changeIndex(event: any) {
    console.log(event);
    this.selectedIndex = event;
  }
  previous() {
    this.addAccountComp.previous();
    this.selectedIndex = this.addAccountComp.selectedIndex;
  }
  saveANext() {
    this.addAccountComp.saveANext();
  }

  APPLICANT_ID!: number;

  openFormDrawer(data: BasicInfo) {

    const drawerRef = this.drawerService.create({
      nzTitle: "Form",
      nzFooter: this.FormFooterTemplate,
      nzContent: this.formDrawerTemp,
      nzWidth: 1095
    });

    this.drawerReferance = drawerRef;

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Template) open');
      this.APPLICANT_ID = data.ID;
    });

    drawerRef.afterClose.subscribe(() => {
      console.log('Drawer(Template) close');
      this.getDrafts();
    });

  }

  downloadPDF() {
    this.formComp.save();
  }



  openUploadDrawer(data: BasicInfo) {
    const drawerRef = this.drawerService.create({
      nzTitle: "Document",
      nzFooter: this.DocFooterTemplate,
      nzContent: this.docDrawerTemp,
      nzWidth: 1095
    });

    this.drawerReferance = drawerRef;

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Template) open');
      this.APPLICANT_ID = data.ID;
    });

    drawerRef.afterClose.subscribe(() => {
      console.log('Drawer(Template) close');
      this.getDrafts();
    });
  }


  saveUploadDrawer() {
    this.drawerReferance.close();
  }

}
