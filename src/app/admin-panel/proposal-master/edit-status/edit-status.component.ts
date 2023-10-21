import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BasicInfo } from 'src/app/models/basicInfo';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-edit-status',
  templateUrl: './edit-status.component.html',
  styleUrls: ['./edit-status.component.css']
})
export class EditStatusComponent implements OnInit {

  constructor(private api:ApiService,private message:NzNotificationService) { }

  ngOnInit(): void {

  }

  STATUS_LIST:any = [];
  basicInfo:BasicInfo = new BasicInfo();

  save() {
    this.api.updateBasic(this.basicInfo).subscribe({
      next: (res) => {
        if (res.code == 200) {
          this.message.success("Status updated successfully!", '');


        }
        else {
          this.message.error('Failed to update status', '');

        }
      },
      error: (err) => {
        this.message.error("Internal Server Error!",'');

      }
    })
  }

}
