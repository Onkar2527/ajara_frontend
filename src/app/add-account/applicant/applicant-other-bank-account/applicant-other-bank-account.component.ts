import { Component, OnInit } from '@angular/core';
import { OtherBankAccount } from 'src/app/models/other-bank-account';

@Component({
  selector: 'app-applicant-other-bank-account',
  templateUrl: './applicant-other-bank-account.component.html',
  styleUrls: ['./applicant-other-bank-account.component.css']
})
export class ApplicantOtherBankAccountComponent implements OnInit {

  accountInfo : OtherBankAccount = new OtherBankAccount();
  constructor() { }

  ngOnInit(): void {
  }

}
