import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UsersPage } from './users.page';
import { SharedModule } from '../../shared/shared.module';
import { UserUpdateReadModalPageModule} from '../user-update-read-modal/user-update-read-modal.module';
import { UserUpdateReadModalPage } from '../user-update-read-modal/user-update-read-modal.page';
import { UserAddModalPageModule } from '../user-add-modal/user-add-modal.module';
import { UserAddModalPage } from '../user-add-modal/user-add-modal.page';
import { SearchUsersPipe } from '../../pipes/search-users.pipe';
import { AuthAdminGuard } from 'src/app/shared/guards/auth-admin.guard';
const routes: Routes = [
  {
    path: '',
    component: UsersPage,
    canActivate: [AuthAdminGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
    UserUpdateReadModalPageModule,
    UserAddModalPageModule
  ],
  entryComponents: [UserUpdateReadModalPage, UserAddModalPage],
  declarations: [UsersPage, SearchUsersPipe]
})
export class UsersPageModule {}
