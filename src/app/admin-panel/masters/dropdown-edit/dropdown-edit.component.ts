import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DropdownTableFields, TableData } from '../dropdown-models/dropdown-models';
import { ApiService } from 'src/app/service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-dropdown-edit',
  templateUrl: './dropdown-edit.component.html',
  styleUrls: ['./dropdown-edit.component.css']
})
export class DropdownEditComponent implements OnInit {

  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnInit(): void {
  }

  @Output() closeDrawer: EventEmitter<any> = new EventEmitter<any>();

  saveButtonLoading: boolean = false;

  TABLE_LOADING: boolean = false;

  IS_NEW: boolean = true;

  DROPDOWN_OPTIONS: TableData = new TableData();

  editCache: { [key: string]: { edit: boolean; data: DropdownTableFields } } = {};


  close() {
    this.closeDrawer.emit();
  }

  mendetory_all = [
    { field: 'NAME', message: 'Dropdown Name' },
    { field: 'TABLE_NAME', message: 'Dropdown Table Name' }
  ]

  save() {
    this.saveButtonLoading = true;

    let isOk = true;

    for (let field of this.mendetory_all) {
      if (!this.DROPDOWN_OPTIONS[field.field as keyof TableData]) {
        this.message.error(`${field.message} is Mandatory`, '');
        isOk = false;
      }
    }

    if (isOk) {

      if (this.DROPDOWN_OPTIONS.ID) {
        this.api.updateDropdown(this.DROPDOWN_OPTIONS).subscribe({
          next: (res) => {
            if (res['code'] == 200) {
              this.saveButtonLoading = false;
              this.message.success("Successfully Updated Dropdown.", "");
              this.closeDrawer.emit();
            }
            else {
              this.saveButtonLoading = false;
              this.message.error("Failed to Update Dropdown.", "");
            }
          },
          error: () => {
            this.saveButtonLoading = false;
            this.message.error("Failed to Update Dropdown.", "");
          }
        })
      }
      else {
        this.api.createDropdown(this.DROPDOWN_OPTIONS).subscribe({
          next: (res) => {
            if (res['code'] == 200) {
              this.saveButtonLoading = false;
              this.message.success("Successfully Created Dropdown.", "");
              this.closeDrawer.emit();
            }
            else {
              this.saveButtonLoading = false;
              this.message.error("Failed to Create Dropdown.", "");
            }
          },
          error: () => {
            this.saveButtonLoading = false;
            this.message.error("Failed to Create Dropdown.", "");
          }
        })
      }

    }

  }

  delete(data: DropdownTableFields) {
    this.api.deleteFileds(data).subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.getDropdownFields();
        }
        else {
          this.message.error("Failed to Delete Field", "");
        }
      },
      error: () => {
        this.message.error("Failed to Delete Field", "");
      }
    })
  }

  updateCache() {
    this.DROPDOWN_OPTIONS.FIELDS.forEach(item => {
      this.editCache[`${item.ID}`] = {
        edit: false,
        data: { ...item }
      };
    });
    this.disableNewButton = false;
  }

  editRow(data: DropdownTableFields) {
    this.editCache[`${data.ID}`].edit = true;
  }

  saveEdit(data: DropdownTableFields) {
    if (data.ID != 0) {
      this.api.updateFields(this.editCache[`${data.ID}`].data).subscribe({
        next: (res) => {
          if (res['code'] == 200) {

            const index = this.DROPDOWN_OPTIONS.FIELDS.findIndex(item => item.ID === data.ID);
            Object.assign(this.DROPDOWN_OPTIONS.FIELDS[index], this.editCache[`${data.ID}`].data);
            this.editCache[`${data.ID}`].edit = false;

            this.message.success("Successfully Updated Field", "");
          }
          else {
            this.message.error("Failed to Update Field", '');
          }
        },
        error: () => {
          this.message.error("Failed to Update Field", '');
        }
      })
    }
    else {
      this.api.createFields(this.editCache['0'].data).subscribe({
        next: (res) => {
          if (res['code'] == 200) {
            this.getDropdownFields();
            this.message.success("Successfully Updated Field", "");
          }
          else {
            this.message.error("Failed to Update Field", '');
          }
        },
        error: () => {
          this.message.error("Failed to Update Field", '');
        }
      })
    }

  }


  getDropdownFields() {
    this.TABLE_LOADING = true;
    let filter = {
      TABLE_NAME: this.DROPDOWN_OPTIONS.TABLE_NAME
    }

    this.api.getDropdownFields(filter).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.TABLE_LOADING = false;
          this.DROPDOWN_OPTIONS.FIELDS = res['data'];
          this.updateCache();
          this.disableNewButton = false;
        }
        else if (res['data'].length == 0) {
          this.TABLE_LOADING = false;
          this.DROPDOWN_OPTIONS.FIELDS = res['data'];
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

  cancelEdit(data: DropdownTableFields) {
    if (data.ID != 0) {
      const index = this.DROPDOWN_OPTIONS.FIELDS.findIndex(item => item.ID === data.ID);
      this.editCache[`${data.ID}`] = {
        data: { ...this.DROPDOWN_OPTIONS.FIELDS[index] },
        edit: false
      };
    }

    else {
      this.DROPDOWN_OPTIONS.FIELDS = this.DROPDOWN_OPTIONS.FIELDS.filter(d => d.ID !== data.ID);
      delete this.editCache['0'];
      this.disableNewButton = false
    }

    console.log("cancle edit", this.editCache);
  }

  disableNewButton: boolean = false;

  addNewField() {
    this.TABLE_LOADING = true;
    this.disableNewButton = true;

    let newItem: DropdownTableFields = {
      ID: 0,
      FIELD_NAME: '',
      FIELD_TYPE: '',
      TABLE_NAME: this.DROPDOWN_OPTIONS.TABLE_NAME,
    };

    this.DROPDOWN_OPTIONS.FIELDS = [
      newItem, ...this.DROPDOWN_OPTIONS.FIELDS
    ];

    this.editCache['0'] = {
      edit: true,
      data: { ...newItem }
    }

    console.log("Edit Cache", this.editCache);
    console.log("data", this.DROPDOWN_OPTIONS.FIELDS)
    this.TABLE_LOADING = false;
  }
}
