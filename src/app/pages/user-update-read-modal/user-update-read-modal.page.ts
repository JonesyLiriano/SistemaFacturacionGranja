import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-update-read-modal',
  templateUrl: './user-update-read-modal.page.html',
  styleUrls: ['./user-update-read-modal.page.scss'],
})
export class UserUpdateReadModalPage implements OnInit {
  @Input() user: User;
  showPassword = false;

  constructor(private modalController: ModalController, private alertController: AlertController,
              private userService: UsersService) { }

  ngOnInit() {
  }

  async onClickSubmit() {
    const alert = await this.alertController.create({
        header: 'Confirmacion!',
        message: 'Esta seguro que desea aplicar los <strong>cambios</strong>?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: 'Aceptar',
            handler: () => {
              this.userService.updateUser(this.user);
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
    onChange(selectValue) {
      this.user.level = selectValue;
    }


}
