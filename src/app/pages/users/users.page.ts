import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { UserUpdateReadModalPage } from '../user-update-read-modal/user-update-read-modal.page';
import { UsersService } from 'src/app/services/users.service';
import { UserAddModalPage } from '../user-add-modal/user-add-modal.page';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  user: User;
  users: User[];

  constructor(private modalController: ModalController, private alertController: AlertController,
              private userService: UsersService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
   this.userService.getUsers().subscribe(data => {
    this.users = data;
   });
  }

  async deleteUser(user: User) {
    const alert = await this.alertController.create({
      header: 'Confirmacion!',
      message: 'Esta seguro que desea <strong>eliminar</strong> este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Eliminar',
          handler: () => {
            this.userService.deleteUser(user);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentUpdateModal(user: User) {
    const modal = await this.modalController.create({
    component: UserUpdateReadModalPage,
    componentProps: { user }
  });

    await modal.present();
  }

  async presentAddModal() {
    console.log('addmodal');
    const modal = await this.modalController.create({
    component: UserAddModalPage
  });

    await modal.present();
  }

}
