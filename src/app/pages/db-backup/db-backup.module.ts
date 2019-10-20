import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DbBackupPage } from './db-backup.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthAdminGuard } from 'src/app/shared/guards/auth-admin.guard';

const routes: Routes = [
  {
    path: '',
    component: DbBackupPage,
    canActivate: [AuthAdminGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DbBackupPage]
})
export class DbBackupPageModule {}
