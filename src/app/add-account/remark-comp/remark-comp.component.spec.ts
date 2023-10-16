import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarkCompComponent } from './remark-comp.component';

describe('RemarkCompComponent', () => {
  let component: RemarkCompComponent;
  let fixture: ComponentFixture<RemarkCompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemarkCompComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemarkCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
