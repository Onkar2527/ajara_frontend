import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownEditComponent } from './dropdown-edit.component';

describe('DropdownEditComponent', () => {
  let component: DropdownEditComponent;
  let fixture: ComponentFixture<DropdownEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
