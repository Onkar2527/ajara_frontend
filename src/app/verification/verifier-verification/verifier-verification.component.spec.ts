import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifierVerificationComponent } from './verifier-verification.component';

describe('VerifierVerificationComponent', () => {
  let component: VerifierVerificationComponent;
  let fixture: ComponentFixture<VerifierVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifierVerificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifierVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
