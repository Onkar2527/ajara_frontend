import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/service/api.service';
import { TableData } from '../dropdown-models/dropdown-models';

@Component({
  selector: 'app-dropdown-items-edit',
  templateUrl: './dropdown-items-edit.component.html',
  styleUrls: ['./dropdown-items-edit.component.css']
})
export class DropdownItemsEditComponent implements OnInit {

  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnInit(): void {
  }

  @Output() closeDrawer: EventEmitter<any> = new EventEmitter<any>();

  editCache: { [key: string]: { edit: boolean; data: any } } = {};

  TABLE_LOADING: boolean = false;

  DROPDOWN_ITEM_DATA: TableData = new TableData();

  delete(data:any) {

    let requestData = {
      TABLE_NAME: this.DROPDOWN_ITEM_DATA.TABLE_NAME,
      DATA: data
    }

    this.api.deleteDropdownItems(requestData).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.getDropdownItem()
        }
        else {
          this.message.error("Failed to Delete Dropdown Item", "");
        }
      },
      error: () => {
        this.message.error("Failed to Delete Dropdown Item", "");
      }
    })
  }

  editRow(data:any) {
    this.editCache[`${data.ID}`].edit = true;
  }

  saveEdit(data:any) {

    let requestData = {
      TABLE_NAME: this.DROPDOWN_ITEM_DATA.TABLE_NAME,
      DATA: this.editCache[`${data.ID}`].data
    }

    if (data.ID != 0) {
      this.api.updateDropdownItems(requestData).subscribe({
        next: (res) => {
          if (res['code'] == 200) {

            const index = this.DROPDOWN_ITEM_DATA.DROPDOWN_DATA.findIndex((item:any) => item.ID === data.ID);
            Object.assign(this.DROPDOWN_ITEM_DATA.DROPDOWN_DATA[index], this.editCache[`${data.ID}`].data);
            this.editCache[`${data.ID}`].edit = false;

            this.message.success("Successfully Updated Dropdown Item", "");
          }
          else {
            this.message.error("Failed to Update Dropdown Item", '');
          }
        },
        error: () => {
          this.message.error("Failed to Update Dropdown Item", '');
        }
      })
    }
    else {
      this.api.createDropdownItems(requestData).subscribe({
        next: (res) => {
          if (res['code'] == 200) {
            this.getDropdownItem();
            this.message.success("Successfully created Dropdown Item", "");
          }

          else {
            this.message.error("Failed to create Dropdown Item", '');
          }
        },
        error: () => {
          this.message.error("Failed to create Dropdown Item", '');
        }

      })
    }

  }

  cancelEdit(data:any) {
    if (data.ID != 0) {
      const index = this.DROPDOWN_ITEM_DATA.DROPDOWN_DATA.findIndex((item:any) => item.ID === data.ID);
      this.editCache[`${data.ID}`] = {
        data: { ...this.DROPDOWN_ITEM_DATA.DROPDOWN_DATA[index] },
        edit: false
      };
    }
    else {
      this.DROPDOWN_ITEM_DATA.DROPDOWN_DATA = this.DROPDOWN_ITEM_DATA.DROPDOWN_DATA.filter((d:any) => d.ID !== data.ID);
      delete this.editCache['0'];
      this.disableNewButton = false
    }

    console.log("cancle edit", this.editCache);
    console.log("cancle edit data", this.DROPDOWN_ITEM_DATA.DROPDOWN_DATA);
  }

  updateCache() {
    this.DROPDOWN_ITEM_DATA.DROPDOWN_DATA.forEach((item:any) => {
      this.editCache[`${item.ID}`] = {
        edit: false,
        data: { ...item }
      };
    });

    this.disableNewButton = false;
  }


  disableNewButton: boolean = false;

  addNewItem() {
    this.TABLE_LOADING = true;
    this.disableNewButton = true;
    let newItem: any = {};
    newItem.ID = 0

    for (let field of this.DROPDOWN_ITEM_DATA.FIELDS) {
      if (field.FIELD_NAME != 'ID') {
        newItem[field.FIELD_NAME] = null;
      }
    }

    this.DROPDOWN_ITEM_DATA.DROPDOWN_DATA = [
      newItem, ...this.DROPDOWN_ITEM_DATA.DROPDOWN_DATA
    ];


    this.editCache['0'] = {
      edit: true,
      data: { ...newItem }
    }

    console.log("Edit Cache", this.editCache);
    console.log("data", this.DROPDOWN_ITEM_DATA.DROPDOWN_DATA)
    this.TABLE_LOADING = false;
  }

  getDropdownItem() {
    this.TABLE_LOADING = true;
    let filter = {
      TABLE_NAME:this.DROPDOWN_ITEM_DATA.TABLE_NAME
    }

    this.api.getDropdownItems(filter).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.TABLE_LOADING = false;
          this.DROPDOWN_ITEM_DATA.DROPDOWN_DATA = res['data'];
          this.updateCache();
          this.disableNewButton = false;
        }
        else if (res['data'].length == 0) {
          this.TABLE_LOADING = false;
          this.DROPDOWN_ITEM_DATA.DROPDOWN_DATA = res['data'];
          this.updateCache();
          this.disableNewButton = false;
        }
        else {
          this.TABLE_LOADING = false;
          this.message.error("Something Went Wrong.", "");
          this.disableNewButton = false;
        }
      },
      error: () => {
        this.TABLE_LOADING = false;
        this.message.error("Something Went Wrong.", "");
        this.disableNewButton = false;
      }
    })
  }
}
