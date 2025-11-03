import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PersonalInfo } from 'src/app/models/personal-info';
import { ApplicantFinancialComponent } from '../applicant-financial/applicant-financial.component';
import { ApplicantLoanInfoComponent } from '../applicant-loan-info/applicant-loan-info.component';
import { ApplicantOtherBankAccountComponent } from '../applicant-other-bank-account/applicant-other-bank-account.component';
import { ApplicantPersonalComponent } from '../applicant-personal/applicant-personal.component';
import { ApplicantPropertyComponent } from '../applicant-property/applicant-property.component';

@Component({
  selector: 'app-applicant-tabs',
  templateUrl: './applicant-tabs.component.html',
  styleUrls: ['./applicant-tabs.component.css']
})
export class ApplicantTabsComponent implements OnInit {



  @ViewChild(ApplicantPersonalComponent) personalComp!: ApplicantPersonalComponent;
  @ViewChild(ApplicantFinancialComponent) financialComp!: ApplicantFinancialComponent;
  @ViewChild(ApplicantPropertyComponent) propertyComp!: ApplicantPropertyComponent;
  @ViewChild(ApplicantLoanInfoComponent) loanInfoComp!: ApplicantLoanInfoComponent;
  @ViewChild(ApplicantOtherBankAccountComponent) otherBankAccountComp!: ApplicantOtherBankAccountComponent;

  @Input() personalInfo!:PersonalInfo

  selectedTab: number = 0;

  disabledTabs = [
    { title: 'Personal Information', disabled: false },
    { title: 'Guarantor Information', disabled: false },
    { title: 'Financial Information', disabled: true },
    { title: 'Property Information', disabled: true },
    // { title: 'Loan Information', disabled: true },
    // { title: 'Account In Other Banks', disabled: true },

  ]
  constructor() { }

  ngOnInit(): void {
  }

}
