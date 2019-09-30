import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InvoicesReportPage } from './invoices-report.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthAdminGuard } from 'src/app/shared/guards/auth-admin.guard';

const routes: Routes = [
  {
    path: '',
    component: InvoicesReportPage,
    canActivate: [AuthAdminGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [InvoicesReportPage]
})
export class InvoicesReportPageModule {}
