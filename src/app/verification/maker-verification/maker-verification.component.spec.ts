import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakerVerificationComponent } from './maker-verification.component';

describe('MakerVerificationComponent', () => {
  let component: MakerVerificationComponent;
  let fixture: ComponentFixture<MakerVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakerVerificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakerVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
