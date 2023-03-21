import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantPropertyComponent } from './applicant-property.component';

describe('ApplicantPropertyComponent', () => {
  let component: ApplicantPropertyComponent;
  let fixture: ComponentFixture<ApplicantPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantPropertyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
