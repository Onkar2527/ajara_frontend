import { Component, OnInit } from '@angular/core';
import { Financial } from 'src/app/models/financial';

@Component({
  selector: 'app-applicant-financial',
  templateUrl: './applicant-financial.component.html',
  styleUrls: ['./applicant-financial.component.css']
})
export class ApplicantFinancialComponent implements OnInit {

  constructor() { }

  financialInfo:Financial = new Financial();
  ngOnInit(): void {
  }

}
