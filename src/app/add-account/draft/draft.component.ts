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
  
  }

  edit(data: BasicInfo) {
    this.drawerVisible = true
  }

  close(){
    this.drawerVisible = false
  }

}
