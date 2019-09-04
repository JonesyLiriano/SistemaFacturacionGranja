import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { IonicModule } from '@ionic/angular';

import { InvoicesPage } from './invoices.page';
import { InvoiceDetailsModalPage } from '../invoice-details-modal/invoice-details-modal.page';
import { InvoiceDetailsModalPageModule } from '../invoice-details-modal/invoice-details-modal.module';
import { SearchInvoicesPipe } from 'src/app/pipes/search-invoices.pipe';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: InvoicesPage,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
    InvoiceDetailsModalPageModule
  ],
  entryComponents: [InvoiceDetailsModalPage],
  declarations: [InvoicesPage, SearchInvoicesPipe]
})
export class InvoicesPageModule {}
