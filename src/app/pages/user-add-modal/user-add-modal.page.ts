import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { ModalController, AlertController } from '@ionic/angular';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-add-modal',
  templateUrl: './user-add-modal.page.html',
  styleUrls: ['./user-add-modal.page.scss'],
})
export class UserAddModalPage implements OnInit {
  user: User;
  showPassword = false;

  constructor(private modalController: ModalController, private alertController: AlertController,
              private userService: UsersService) {
                console.log('modal');
              }

  ngOnInit() {

  }

  async onClickSubmit() {
    const alert = await this.alertController.create({
        header: 'Confirmacion!',
        message: 'Esta seguro que desea agregar a este <strong>usuario</strong>?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: 'Aceptar',
            handler: () => {
             this.userService.createUser(this.user);
             this.dismissModal();
            }
          }
        ]
      });
    await alert.present();
    }

  dismissModal() {
    if (this.modalController) {
      this.modalController.dismiss().then(() => { this.modalController = null; });
    }
}


}
