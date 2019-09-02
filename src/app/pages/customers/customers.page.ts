import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { CustomerUpdateReadModalPage } from '../customer-update-read-modal/customer-update-read-modal.page';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
  private icons = [
    'contact'
  ];
  public items: Array<{ title: string; note: string; icon: string }> = [];
  constructor(private alertController: AlertController, private modalController: ModalController) {
    for (let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }
  ngOnInit() {
  }

  async deleteCustomer() {
    const alert = await this.alertController.create({
      header: 'Confirmacion!',
      message: 'Esta seguro que desea <strong>eliminar</strong> este cliente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Eliminar',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  async presentUpdateModal() {
    const modal = await this.modalController.create({
    component: CustomerUpdateReadModalPage,
    componentProps: { value: 123 }
  });

    await modal.present();
  }

}
