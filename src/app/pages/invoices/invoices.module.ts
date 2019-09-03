import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { IonicModule } from '@ionic/angular';

import { InvoicesPage } from './invoices.page';

const routes: Routes = [
  {
    path: '',
    component: InvoicesPage
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
  declarations: [InvoicesPage]
})
export class InvoicesPageModule {}
