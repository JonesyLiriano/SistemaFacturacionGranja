import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UsersPage } from './users.page';
import { SharedModule } from '../../shared/shared.module';
import { UserUpdateReadModalPageModule} from '../user-update-read-modal/user-update-read-modal.module';
import { UserUpdateReadModalPage } from '../user-update-read-modal/user-update-read-modal.page';

const routes: Routes = [
  {
    path: '',
    component: UsersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
    UserUpdateReadModalPageModule
  ],
  entryComponents: [UserUpdateReadModalPage],
  declarations: [UsersPage]
})
export class UsersPageModule {}
