import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CustomerUpdateReadModalPageModule } from '../customer-update-read-modal/customer-update-read-modal.module';

import { IonicModule } from '@ionic/angular';

import { CustomersPage } from './customers.page';
import { CustomerUpdateReadModalPage } from '../customer-update-read-modal/customer-update-read-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CustomersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
    CustomerUpdateReadModalPageModule
  ],
  declarations: [CustomersPage],
  entryComponents: [CustomerUpdateReadModalPage]
})
export class CustomersPageModule {}
