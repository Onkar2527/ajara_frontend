import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantPersonalComponent } from './applicant-personal.component';

describe('ApplicantPersonalComponent', () => {
  let component: ApplicantPersonalComponent;
  let fixture: ComponentFixture<ApplicantPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantPersonalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
