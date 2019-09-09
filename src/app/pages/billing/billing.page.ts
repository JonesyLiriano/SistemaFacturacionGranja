import { Component, OnInit } from '@angular/core';
import {formatDate} from '@angular/common';
import { Customer } from '../../models/customer';
import { Invoice } from 'src/app/models/invoice';
import { InvoiceDetails } from 'src/app/models/invoice-details';
import { AlertController } from '@ionic/angular';
import { InvoicesService } from 'src/app/services/invoices.service';
import { CustomersService } from 'src/app/services/customers.service';
import { Storage } from '@ionic/storage';

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
  constructor(private alertController: AlertController, private invoiceService: InvoicesService,
              private customerService: CustomersService, private storage: Storage) {
  }

  ngOnInit() {
    this.invoice = {
      id: null,
      customer: null,
      pricePounds: null,
      licensePlate: '',
      paymentMethod: 'N/A',
      lotProduct: null,
      date: formatDate(Date.now(), 'dd-MM-yyyy hh:mm:ss', 'en-US'),
      user: null
    };
    this.storage.get('userID').then( data => {
      this.invoice.user = data;
    });
    this.getCustomers();
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
          text: 'Aceptar',
          handler: () => {
           this.complete();
           this.clearScreen();
           this.printInvoice();
          }
        }
      ]
    });

    await alert.present();
  }

  getCustomers() {
   this.customerService.getCustomers().subscribe(data => {
    this.customers = data;
   });
  }

  clearScreen() {
    this.invoice = null;
  }

  printInvoice() {
    console.log('print');
  }

  complete() {
    this.createInvoice();
  }

  createInvoice() {
    this.invoiceService.createInvoice(this.invoice);
    this.invoiceService.getLastInvoiceID().then(data => {
      this.createInvoiceDetails(data);
    });
  }

  createInvoiceDetails(lastInvoiceID: number) {
    this.lineDetails.forEach(element => {
      element.invoice = lastInvoiceID;
      this.invoiceService.createInvoiceDetails(element);
    });

  }

  setResult() {
    this.totalGross = 0;
    this.totalTare = 0;
    this.lineDetails.forEach(element => {
      this.totalGross += +element.grossWeight;
      this.totalTare += +element.tareWeight;
    });
    this.totalNetWeight = Math.abs(this.totalTare - this.totalGross);
    this.average = (+this.totalNetWeight.toFixed(2) * +this.invoice.pricePounds.toFixed(2)) / +this.invoice.lotProduct.toFixed(2);
  }
}
