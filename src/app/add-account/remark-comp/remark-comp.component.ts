import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ExtraInfo } from 'src/app/models/extra-info';
import { RemarkModel } from 'src/app/models/remark-model';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-remark-comp',
  templateUrl: './remark-comp.component.html',
  styleUrls: ['./remark-comp.component.css']
})
export class RemarkCompComponent implements OnInit {

  APPLICAT_ID!: number;
  TableLoading: boolean = false;
  remark_table_loading: boolean = false;
  Tabs: ExtraInfo[] = []

  show_remark: boolean = false;

  REMARK_DATA: RemarkModel[] = [
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
    // { ID: 1, USER_NAME: 'Test BA', ROLE: 'MAKER', REMARK: 'fsdgfsd dfg dhsfgdhfsdhfgdshf dghfsffsd f', REMARK_DATE: '14/10/2023 16:43', APPLICANT_ID: 230, USER_ID: 8 },
  ];

  REMARK: string = '';

  getRemarkData() {
    this.api.getAllRemark(this.APPLICAT_ID).subscribe({
      next: (res) => {
        if (res['code'] == 200 && res['data'].length > 0) {
          this.REMARK_DATA = res['data'];
        }
      }
    })
  }

  createRemark(data: RemarkModel) {
    this.api.createRemark(data).subscribe({
      next: (res) => {
        if (res['code'] == 200) {

        }
      }
    })
  }

  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnInit(): void {
  }

}
