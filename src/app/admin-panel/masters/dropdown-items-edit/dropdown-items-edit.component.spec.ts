import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownItemsEditComponent } from './dropdown-items-edit.component';

describe('DropdownItemsEditComponent', () => {
  let component: DropdownItemsEditComponent;
  let fixture: ComponentFixture<DropdownItemsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropdownItemsEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownItemsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
