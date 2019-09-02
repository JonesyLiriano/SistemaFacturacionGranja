import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUpdateReadModalPage } from './user-update-read-modal.page';

describe('UserUpdateReadModalPage', () => {
  let component: UserUpdateReadModalPage;
  let fixture: ComponentFixture<UserUpdateReadModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserUpdateReadModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUpdateReadModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
