import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InvoiceDetailsModalPage } from './invoice-details-modal.page';

const routes: Routes = [
  {
    path: '',
    component: InvoiceDetailsModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InvoiceDetailsModalPage]
})
export class InvoiceDetailsModalPageModule {}
