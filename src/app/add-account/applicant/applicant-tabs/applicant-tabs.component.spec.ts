import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantTabsComponent } from './applicant-tabs.component';

describe('ApplicantTabsComponent', () => {
  let component: ApplicantTabsComponent;
  let fixture: ComponentFixture<ApplicantTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicantTabsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicantTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
