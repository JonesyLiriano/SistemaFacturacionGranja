import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-customer-update-read-modal',
  templateUrl: './customer-update-read-modal.page.html',
  styleUrls: ['./customer-update-read-modal.page.scss'],
})
export class CustomerUpdateReadModalPage implements OnInit {

  constructor(private alertController: AlertController, private modalController: ModalController) { }

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
