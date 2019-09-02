import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-update-read-modal',
  templateUrl: './user-update-read-modal.page.html',
  styleUrls: ['./user-update-read-modal.page.scss'],
})
export class UserUpdateReadModalPage implements OnInit {
  showPassword = false;

  constructor(private modalController: ModalController, private alertController: AlertController) { }
  @Input() user: User;
  ngOnInit() {
  }

  async onSubmit(form: any) {
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
              console.log('Confirm Okay');
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
