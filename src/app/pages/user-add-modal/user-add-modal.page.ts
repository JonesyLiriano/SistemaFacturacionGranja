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
  refreshView = false;

  constructor(private modalController: ModalController, private alertController: AlertController,
              private userService: UsersService) {
              }

  ngOnInit() {
    this.user = {
      id: null  ,
      username: '',
      password: '',
      level: 'user'
    };
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
             this.refreshView = true;
             this.dismissModal();
            }
          }
        ]
      });
    await alert.present();
    }

  dismissModal() {
    if (this.modalController) {
      this.modalController.dismiss({
        refreshView: this.refreshView
      }).then(() => { this.modalController = null; });
    }
}

onChange(selectValue) {
  this.user.level = selectValue;
}


}
