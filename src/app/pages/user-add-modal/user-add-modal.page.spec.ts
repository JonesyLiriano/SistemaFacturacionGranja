import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddModalPage } from './user-add-modal.page';

describe('UserAddModalPage', () => {
  let component: UserAddModalPage;
  let fixture: ComponentFixture<UserAddModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAddModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAddModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
