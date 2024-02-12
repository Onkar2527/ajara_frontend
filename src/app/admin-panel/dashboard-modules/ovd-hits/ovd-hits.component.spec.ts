import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvdHitsComponent } from './ovd-hits.component';

describe('OvdHitsComponent', () => {
  let component: OvdHitsComponent;
  let fixture: ComponentFixture<OvdHitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OvdHitsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OvdHitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
