import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckerVerificationComponent } from './checker-verification.component';

describe('CheckerVerificationComponent', () => {
  let component: CheckerVerificationComponent;
  let fixture: ComponentFixture<CheckerVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckerVerificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckerVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
