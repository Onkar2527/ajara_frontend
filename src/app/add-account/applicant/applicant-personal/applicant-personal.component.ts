import { Component, Input, OnInit } from '@angular/core';
import { PersonalInfo } from 'src/app/models/personal-info';

@Component({
  selector: 'app-applicant-personal',
  templateUrl: './applicant-personal.component.html',
  styleUrls: ['./applicant-personal.component.css']
})
export class ApplicantPersonalComponent implements OnInit {
  @Input() personalInfo!:PersonalInfo;
  constructor() { }

  ngOnInit(): void {
  }

}
