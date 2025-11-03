import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantGuarantorComponent } from './applicant-guarantor.component';

describe('ApplicantGuarantorComponent', () => {
  let component: ApplicantGuarantorComponent;
  let fixture: ComponentFixture<ApplicantGuarantorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantGuarantorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantGuarantorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
