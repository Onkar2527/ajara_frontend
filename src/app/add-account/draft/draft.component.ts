import { Component, OnInit } from '@angular/core';
import { BasicInfo } from 'src/app/models/basicInfo';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-draft',
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.css']
})
export class DraftComponent implements OnInit {

  draftList: BasicInfo[] = []
  BasicInfo: BasicInfo = new BasicInfo();
  drawerVisible: boolean = false;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getDraft().subscribe({
      next: (res) => {
        if (res['code'] == 200) {
          this.draftList = res['data'];
        }
        else {

        }
      },
      error: () => {

      },
      complete: () => {

      }
    })
  }

  edit(data: BasicInfo) {
    this.drawerVisible = true
  }

  close(){
    this.drawerVisible = false
  }

}
