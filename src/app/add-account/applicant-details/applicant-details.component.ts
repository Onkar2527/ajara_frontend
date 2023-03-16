import { Component, OnInit } from '@angular/core';
import { PersonalInfo } from 'src/app/models/personal-info';

@Component({
  selector: 'app-applicant-details',
  templateUrl: './applicant-details.component.html',
  styleUrls: ['./applicant-details.component.css']
})
export class ApplicantDetailsComponent implements OnInit {
  ApplicantData:PersonalInfo[] = [];
  DrawerVisible:boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  close(){
    this.DrawerVisible = false;
  }

  edit(data:PersonalInfo){
    this.DrawerVisible = true;
    
  }

}
