import { Component, OnInit } from '@angular/core';
import { Customer } from '../../models/customer';
import { Invoice } from 'src/app/models/invoice';
import { InvoiceDetails } from 'src/app/models/invoice-details';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.page.html',
  styleUrls: ['./billing.page.scss'],
})
export class BillingPage implements OnInit {
  customers: Customer[];
  invoice: Invoice;
  lineDetails: InvoiceDetails[] = [];
  totalTare: number;
  totalGross: number;
  totalNetWeight: number;
  average: number;
  lotProduct: number;
  pricePounds: number;
  constructor(private alertController: AlertController) {
  }

  ngOnInit() {
    this.invoice = {
      id: null,
      customer: null,
      pricePounds: null,
      licensePlate: '',
      paymentMethod: null,
      lotProduct: null,
      date: null,
      user: null
    };
  }

  async deleteLine(index) {
    const alert = await this.alertController.create({
      header: 'Confirmacion!',
      message: 'Esta seguro que desea <strong>eliminar</strong> esta linea?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Eliminar',
          handler: () => {
            this.lineDetails.splice(index, 1);
            this.lineDetails = [...this.lineDetails];
            this.setResult();
          }
        }
      ]
    });
    await alert.present();
  }

  async addLine() {
    const alert = await this.alertController.create({
      header: 'Añadir nueva linea',
      message: 'Ingrese la <strong>tara</strong> y el <strong>peso bruto</strong>.',
      inputs: [
        {
          name: 'tare',
          placeholder: 'Tara',
          type: 'number'
        },
        {
          name: 'gross',
          placeholder: 'Peso bruto',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Agregar',
          handler: data => {
            this.lineDetails.push(
              {
                id: null,
                invoice: null,
                tareWeight: data.tare,
                grossWeight: data.gross
              });
            this.setResult();
          }
        }
      ]
    });
    await alert.present();
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirmacion!',
      message: 'Esta seguro que desea realizar la <strong>facturar</strong>?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Okay',
          handler: () => {
           this.complete();
          }
        }
      ]
    });

    await alert.present();
  }

  complete() {}

  setResult() {
    this.totalGross = 0;
    this.totalTare = 0;
    this.lineDetails.forEach(element => {
      this.totalGross += +element.grossWeight;
      this.totalTare += +element.tareWeight;
    });
    this.totalNetWeight = Math.abs(this.totalTare - this.totalGross);
    this.average = (+this.totalNetWeight.toFixed(2) * +this.pricePounds.toFixed(2)) / +this.lotProduct.toFixed(2);
  }
}
