import { BluetoothSerialService } from './../../services/bluetooth-serial.service';
import { Component, OnInit, LOCALE_ID, AfterViewInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { Customer } from '../../models/customer';
import { Invoice } from 'src/app/models/invoice';
import { InvoiceDetails } from 'src/app/models/invoice-details';
import { AlertController, LoadingController } from '@ionic/angular';
import { InvoicesService } from 'src/app/services/invoices.service';
import { CustomersService } from 'src/app/services/customers.service';
import { Storage } from '@ionic/storage';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.page.html',
  styleUrls: ['./billing.page.scss'],
})
export class BillingPage implements OnInit, AfterViewInit {
  customers: Customer[];
  invoice: Invoice;
  lineDetails: InvoiceDetails[] = [];
  totalTare: number;
  totalGross: number;
  totalNetWeight: number;
  average: number;
  totalPrice: number;
  errorData: boolean;
  constructor(private alertController: AlertController, private invoiceService: InvoicesService,
              private customerService: CustomersService, private storage: Storage,
              private printerBluetoothService: BluetoothSerialService, private toastService: ToastService,
              private loadingController: LoadingController) {
  }

  ngOnInit() {
    this.errorData = true;
    this.inicializeVar();
    this.getCustomers();
  }

  ngAfterViewInit() {
    this.loadingController.dismiss().then();
  }

  inicializeVar() {
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
    this.storage.get('userID').then(data => {
      this.invoice.user = data;
    });
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
            if (data.tare === '') {
              data.tare = 0;
            }
            if (data.gross === '') {
              data.gross = 0;
            }
            this.addLineDetail(data);
            this.setResult();
          }
        }
      ]
    });
    await alert.present();
  }

  addLineDetail(data) {
    if (data.tare !== 0) {
      const indexTare = this.lineDetails.findIndex(x => x.tareWeight === 0);
      if (indexTare !== -1) {
        this.lineDetails[indexTare].tareWeight = data.tare;
        data.tare = 0;
      }
    }
    if (data.gross !== 0) {
      const indexGrossWeight = this.lineDetails.findIndex(x => x.grossWeight === 0);
      if (indexGrossWeight !== -1) {
        this.lineDetails[indexGrossWeight].grossWeight = data.gross;
        data.gross = 0;
      }
    }
    if (!(data.tare === 0 && data.gross === 0)) {
      this.lineDetails.push(
        {
          id: null,
          invoice: null,
          tareWeight: data.tare,
          grossWeight: data.gross
        });
    }
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
    this.inicializeVar();
    this.lineDetails.length = 0;
    this.totalTare = null;
    this.totalGross = null;
    this.average = null;
    this.totalNetWeight = null;
    this.totalPrice = null;
  }

  printInvoice(invoice) {
    this.printerBluetoothService.bluetoothConnect(invoice);
  }

  complete() {
    this.createInvoice().then(() => {
      this.printInvoice(this.invoice);
      this.clearScreen();
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

  checkPricePounds() {
    if (isNaN(this.invoice.pricePounds)) {
      this.errorData = true;
      this.toastService.presentDefaultToast('El precio por libras tiene que ser un numero valido...');
    } else {
      this.errorData = false;
    }
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
