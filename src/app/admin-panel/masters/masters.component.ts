import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DropdownEditComponent } from './dropdown-edit/dropdown-edit.component';
import { DropdownItemsEditComponent } from './dropdown-items-edit/dropdown-items-edit.component';
import { ApiService } from 'src/app/service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Drawer, Table, TableData } from './dropdown-models/dropdown-models';
import { NzDrawerRef, NzDrawerService } from 'ng-zorro-antd/drawer';

@Component({
  selector: 'app-masters',
  templateUrl: './masters.component.html',
  styleUrls: ['./masters.component.css']
})
export class MastersComponent implements OnInit {

  @ViewChild(DropdownEditComponent) dropdownEditComp!: DropdownEditComponent;
  @ViewChild(DropdownItemsEditComponent) dropdownEditItemComp!: DropdownItemsEditComponent;

  @ViewChild('editItem', { static: false }) editItem?: TemplateRef<{
    $implicit: {};
    drawerRef: NzDrawerRef<any>;
  }>;

  @ViewChild('editFields', { static: false }) editFields?: TemplateRef<{
    $implicit: {};
    drawerRef: NzDrawerRef<any>;
  }>;

   @ViewChild('editFieldFooter', { static: false }) editFieldFooter?: TemplateRef<{}>;

  constructor(private api: ApiService, private message: NzNotificationService, private drawerService: NzDrawerService) { }



  ngOnInit(): void {
    this.getAllDropdownData();
  }

  SEARCH_FIELD: string = '';

  DROPDOWN_TABLE: Table = new Table();

  editDrawer: Drawer = new Drawer();
  editItemDrawer: Drawer = new Drawer();


  drawerReferance:any;

  getAllDropdownData(search: boolean = false) {
    this.DROPDOWN_TABLE.LOADING = true;
    let filter = {};

    if (search) {
      filter = {
        keyword: this.SEARCH_FIELD,
        search: true
      }
    }
    else {
      filter = {
        pageSize: this.DROPDOWN_TABLE.PAGE_SIZE,
        pageIndex: this.DROPDOWN_TABLE.PAGE_INDEX,
        search: false
      }
    }


    this.api.getAllDropdown(filter).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.DROPDOWN_TABLE.TOTAL_RECORDS = res['total_count'];
          this.DROPDOWN_TABLE.DROPDOWN_LIST = res['data'];
          this.DROPDOWN_TABLE.LOADING = false;
        }
        else {
          this.DROPDOWN_TABLE.LOADING = false;
        }
      },
      error: () => {
        this.DROPDOWN_TABLE.LOADING = false;
      }
    });

  }

  addNewDropdown() {
    this.editDrawer.TITLE = 'Add New Dropdown'
    // this.editDrawer.OPEN();


    const drawerRef = this.drawerService.create({
      nzTitle: this.editDrawer.TITLE,
      nzFooter: this.editFieldFooter,
      nzContent: this.editFields,
      // nzExtra: this.header,
      nzWidth: window.screen.availWidth,

    });

    this.drawerReferance = drawerRef;

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Template) open');
      this.dropdownEditComp.IS_NEW = true;
      this.dropdownEditComp.DROPDOWN_OPTIONS = new TableData();
    });

    drawerRef.afterClose.subscribe(() => {
      console.log('Drawer(Template) close');
      this.getAllDropdownData();
    });


  }

  editDropdown(data: TableData) {
    this.editDrawer.TITLE = 'Edit Dropdown'
    // this.editDrawer.OPEN();


    const drawerRef = this.drawerService.create({
      nzTitle: this.editDrawer.TITLE,
      nzFooter: this.editFieldFooter,
      nzContent: this.editFields,
      // nzExtra: this.header,
      nzWidth: window.screen.availWidth,

    });

    this.drawerReferance = drawerRef;

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Template) open');
      this.dropdownEditComp.IS_NEW = false;

      this.dropdownEditComp.DROPDOWN_OPTIONS = data;
      this.dropdownEditComp.updateCache();
      console.log('Table data', data)
    });

    drawerRef.afterClose.subscribe(() => {
      console.log('Drawer(Template) close');
      this.getAllDropdownData();
    });

  }

  saveEditField(){
    this.dropdownEditComp.save();
  }

  deleteDropdown(data: TableData) {
    this.api.deleteDropdown(data).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.message.success(`Successfully Deleted Dropdown ${data.NAME}`, '');
          this.getAllDropdownData();
        }
        else {
          console.error(res);
          this.message.error(`Failed To Delete Dropdown ${data.NAME}`, '');
        }
      },
      error: () => {
        this.message.error(`Failed To Delete Dropdown ${data.NAME}`, '');
      }
    })
  }

  editItems(data: TableData) {
    this.editItemDrawer.TITLE = 'Add / Edit Dropdown Items'
    // this.editItemDrawer.OPEN();
    console.log('Table data', data)

    const drawerRef = this.drawerService.create({
      nzTitle: this.editItemDrawer.TITLE,
      // nzFooter: this.footer,
      nzContent: this.editItem,
      // nzExtra: this.header,
      nzWidth: window.screen.availWidth,

    });


    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Template) open');
      this.dropdownEditItemComp.DROPDOWN_ITEM_DATA = data;
      this.dropdownEditItemComp.updateCache();
    });

    drawerRef.afterClose.subscribe(() => {
      console.log('Drawer(Template) close');
      this.getAllDropdownData();
    });

  }

  search() {
    this.getAllDropdownData(true);
  }

  closeEditDrawer() {
    this.drawerReferance.close();
  }
  // closeEditItemDrawer() {
  //   this.editItemDrawer.CLOSE();

  // }

}
