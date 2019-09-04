import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CustomerUpdateReadModalPageModule } from '../customer-update-read-modal/customer-update-read-modal.module';

import { IonicModule } from '@ionic/angular';

import { CustomersPage } from './customers.page';
import { CustomerUpdateReadModalPage } from '../customer-update-read-modal/customer-update-read-modal.page';
import { CustomerAddModalPageModule } from '../customer-add-modal/customer-add-modal.module';
import { CustomerAddModalPage } from '../customer-add-modal/customer-add-modal.page';
import { SearchCustomersPipe } from 'src/app/pipes/search-customers.pipe';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CustomersPage,
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
    CustomerUpdateReadModalPageModule,
    CustomerAddModalPageModule
  ],
  declarations: [CustomersPage, SearchCustomersPipe],
  entryComponents: [CustomerUpdateReadModalPage, CustomerAddModalPage]
})
export class CustomersPageModule {}
