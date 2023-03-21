import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantFinancialComponent } from './applicant-financial.component';

describe('ApplicantFinancialComponent', () => {
  let component: ApplicantFinancialComponent;
  let fixture: ComponentFixture<ApplicantFinancialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantFinancialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantFinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
