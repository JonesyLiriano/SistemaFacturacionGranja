import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { CustomerUpdateReadModalPage } from '../customer-update-read-modal/customer-update-read-modal.page';
import { Customer } from 'src/app/models/customer';
import { CustomersService } from 'src/app/services/customers.service';
import { CustomerAddPage } from '../customer-add/customer-add.page';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
  customer: Customer;
  customers: Customer[];

  constructor(private modalController: ModalController, private alertController: AlertController,
              private customerService: CustomersService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
   this.customerService.getCustomers().subscribe(data => {
    this.customers = data;
   });
  }

  async deleteCustomer(customer: Customer) {
    const alert = await this.alertController.create({
      header: 'Confirmacion!',
      message: 'Esta seguro que desea <strong>eliminar</strong> este cliente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Eliminar',
          handler: () => {
            this.customerService.deleteCustomer(customer);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentUpdateModal(customer: Customer) {
    const modal = await this.modalController.create({
    component: CustomerUpdateReadModalPage,
    componentProps: { customer }
  });

    await modal.present();
  }

  async presentAddModal() {
    const modal = await this.modalController.create({
    component: CustomerAddPage
  });

    await modal.present();
  }

}
