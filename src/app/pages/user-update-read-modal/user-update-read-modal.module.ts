import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserUpdateReadModalPage } from './user-update-read-modal.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
    ],
  declarations: [UserUpdateReadModalPage],
  exports: [UserUpdateReadModalPage]
})
export class UserUpdateReadModalPageModule {}
