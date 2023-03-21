import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantOtherBankAccountComponent } from './applicant-other-bank-account.component';

describe('ApplicantOtherBankAccountComponent', () => {
  let component: ApplicantOtherBankAccountComponent;
  let fixture: ComponentFixture<ApplicantOtherBankAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantOtherBankAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantOtherBankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
