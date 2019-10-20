import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbBackupPage } from './db-backup.page';

describe('DbBackupPage', () => {
  let component: DbBackupPage;
  let fixture: ComponentFixture<DbBackupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbBackupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbBackupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
