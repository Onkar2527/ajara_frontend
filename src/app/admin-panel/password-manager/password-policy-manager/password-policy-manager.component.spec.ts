import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordPolicyManagerComponent } from './password-policy-manager.component';

describe('PasswordPolicyManagerComponent', () => {
  let component: PasswordPolicyManagerComponent;
  let fixture: ComponentFixture<PasswordPolicyManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordPolicyManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordPolicyManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
