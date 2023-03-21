import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantLoanInfoComponent } from './applicant-loan-info.component';

describe('ApplicantLoanInfoComponent', () => {
  let component: ApplicantLoanInfoComponent;
  let fixture: ComponentFixture<ApplicantLoanInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantLoanInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantLoanInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
