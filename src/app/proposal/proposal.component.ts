import { Component, OnInit, ViewChild } from '@angular/core';
import { AddAccountComponent } from '../add-account/add-account/add-account.component';
import { ApiService } from '../service/api.service';
import { BasicInfo } from '../models/basicInfo';
import { PersonalComponent } from '../add-account/personal/personal.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormComponent } from '../add-account/form/form.component';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {

  @ViewChild(AddAccountComponent) addAccountComp!: AddAccountComponent;
  @ViewChild(PersonalComponent) basicComp !:PersonalComponent;
  @ViewChild(FormComponent) formComp !:FormComponent;

  constructor(private api : ApiService,private message: NzNotificationService) { }

  TableLoading = false;

  DraftsData:any = []

  drawerTabsVisible: boolean = false;
  drawerTabsTitle: string = "Draft"
  drawerDraftData:BasicInfo = new BasicInfo;

  pageIndex = 1;
  pageSize = 10;
  dataCount!:number;


  drawerTabsClose() {
    this.selectedIndex = 0;
    this.drawerTabsVisible = false;
    this.getDrafts();
  }

  openTabsDrawer(data:BasicInfo) {
    this.drawerDraftData = data;
    this.drawerTabsVisible = true;
  }


  drawerBasicTitle: string = "New Account"
  drawerBasicVisible: boolean = false
  loadSaveButton:boolean = false;

  drawerBasicClose() {
    this.drawerBasicVisible = false;
    this.getDrafts();
  }
  openBasicDrawer() {
    this.drawerBasicVisible = true;
  }

  createProposal(){
    this.loadSaveButton = true;
    let basic = this.basicComp.save();
    basic.subscribe({
      next: (res) => {
        if (res.code == 200) {
          this.loadSaveButton = false;
          this.drawerBasicClose();
        }
      }, error: () => {
        this.loadSaveButton = false;
      },
      complete: () => {
        this.loadSaveButton = false;
      }
    })
  }

  getDrafts(){
    this.TableLoading = true;
    this.api.getDraft(this.pageSize,this.pageIndex).subscribe({
      next: (res) =>{
        if(res['code'] == 200 && res['data'].length > 0){
          this.DraftsData = res['data'];
          this.dataCount = res['count'];
          this.TableLoading = false;
        }
        else{
          this.TableLoading = false;
        }
      },
      error: (err) =>{
        this.TableLoading = false;
      }
    })
  }

  ngOnInit(): void {
    this.getDrafts();
  }

  selectedIndex = 0;
  changeIndex(event:any){
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

  drawerFormTitle:string = 'Form';
  drawerFormVisible:boolean = false;
  APPLICANT_ID!:number;

  openFormDrawer(data:BasicInfo){
    this.APPLICANT_ID = data.ID;
    this.drawerFormVisible = true;

  }

  drawerFormClose(){
    this.drawerFormVisible = false;
  }

  downloadPDF(){
    this.formComp.save();
  }

  drawerUploadTitle:string = 'Documents';
  drawerUploadVisible = false;

  openUploadDrawer(data:BasicInfo){
    this.APPLICANT_ID = data.ID;
    this.drawerUploadVisible = true; 
  }
  drawerUploadClose(){
    this.drawerUploadVisible = false; 
  }

  saveUploadDrawer(){
    this.drawerUploadClose();
  }

}
