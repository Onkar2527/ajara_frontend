import { Component, OnInit } from '@angular/core';
import { LoanInfo } from 'src/app/models/loan-info';

@Component({
  selector: 'app-applicant-loan-info',
  templateUrl: './applicant-loan-info.component.html',
  styleUrls: ['./applicant-loan-info.component.css']
})
export class ApplicantLoanInfoComponent implements OnInit {
  loanInfo:LoanInfo = new LoanInfo();
  constructor() { }

  ngOnInit(): void {
  }

}
