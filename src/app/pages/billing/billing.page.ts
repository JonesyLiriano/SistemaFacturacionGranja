import { Component, OnInit, LOCALE_ID } from '@angular/core';
import {formatDate} from '@angular/common';
import { Customer } from '../../models/customer';
import { Invoice } from 'src/app/models/invoice';
import { InvoiceDetails } from 'src/app/models/invoice-details';
import { AlertController, NavController } from '@ionic/angular';
import { InvoicesService } from 'src/app/services/invoices.service';
import { CustomersService } from 'src/app/services/customers.service';
import { Storage } from '@ionic/storage';
import { PrintService } from 'src/app/services/print.service';
import { parse } from 'url';
import { Router } from '@angular/router';

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
  totalPrice: number;

  constructor(private alertController: AlertController, private invoiceService: InvoicesService,
              private customerService: CustomersService, private storage: Storage,
              private printerService: PrintService, private router: Router) {
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
    this.lineDetails = null;
  }

  printInvoice(invoice) {
    this.printerService.print(invoice);
  }

  complete() {
    this.createInvoice().then(() => {
     this.printInvoice(this.invoice);
     location.reload(true);
    });
  }

  createInvoice() {
    this.invoiceService.createInvoice(this.invoice);
    return this.invoiceService.getLastInvoiceID().then(data => {
      this.invoice.id = data;
      this.invoice.date = formatDate(Date.now(), 'dd-MM-yyyy hh:mm:ss', 'en-US');
      this.createInvoiceDetails(data);
    });

  }

  createInvoiceDetails(lastInvoiceID: number) {
    this.lineDetails.forEach(element => {
      element.invoice = lastInvoiceID;
      this.invoiceService.createInvoiceDetails(element);
    });

  }

  onChangeLotProduct(event) {
    this.invoice.lotProduct = event;
    this.setResult();
  }
  onChangePricePounds(event) {
    this.invoice.pricePounds = event;
    this.setResult();
  }

  setResult() {
    this.totalGross = 0;
    this.totalTare = 0;
    this.totalPrice = 0;
    this.lineDetails.forEach(element => {
      this.totalGross += +element.grossWeight;
      this.totalTare += +element.tareWeight;
    });
    this.totalNetWeight = Math.abs(this.totalTare - this.totalGross);
    this.average = +(+this.totalNetWeight.toFixed(2) / +this.invoice.lotProduct).toFixed(6);
    this.totalPrice = (+this.invoice.pricePounds * +this.totalNetWeight.toFixed(2));
  }
}
