import { Injectable } from '@angular/core';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { LoadingController } from '@ionic/angular';
import { Invoice } from '../models/invoice';
import { NgForOf, formatNumber } from '@angular/common';
import { InvoiceDetails } from '../models/invoice-details';
import { Customer } from '../models/customer';
import { SqliteDataService } from './sqlite-data.service';
import { CustomersService } from './customers.service';
import { InvoicesService } from './invoices.service';
import { docStyles } from '../mocks/stylesReceipt';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  lineDetails: InvoiceDetails[] = [];
  customer: Customer;
  docLineDetails = '';
  docInfoCustomer;
  docInfoInvoice;
  totalTareWeight = 0;
  totalGrossWeight = 0;
  docStyles = docStyles;
  invoice: Invoice;

  docHeader = `<div id="invoice-POS">
  <center id="top">
    <div class="logo"></div>
    <div class="info">
      <p><h2>Granja G & Y</h2>
      Azua</br>
      Tel: 809-835-5817
      </p>
    </div>
  </center>`;

  docMiddle;

  docFooter = `
  <div id="legalcopy">
  <center class="underscore">Recibido Conforme</center>
  </div>
<div id="legalcopy">
<p class="legal"><strong>Gracias por su compra!</strong>.</br>
Sistema realizado por Jonesy Liriano</br>
Tel: 809-222-3740
</p>
</div>
</div>
</div>`;

  constructor(private printer: Printer, private loadingController: LoadingController,
              private customerService: CustomersService,
              private invoiceDetailsService: InvoicesService,
              private toastService: ToastService) {

  }
  async presentLoading(msg) {
    const loading = await this.loadingController.create({
      message: msg
    });
    return await loading.present();
  }

  print(invoice: Invoice) {
    this.invoice = invoice;
    this.presentLoading('Favor esperar mientras se imprime la factura');
    this.searchCustomer(this.invoice.customer).then(() => {
      this.setCustomerDoc();
    });
    this.searchLineDetails(this.invoice.id).then(() => {
      this.setLineDetailsDoc();
      this.setPrinter();
    });
  }

  setCustomerDoc() {
    this.docInfoCustomer = `<div id="mid">
    <div class="info">
      <h2>${this.customer.name}</h2>
      <p>
          Direccion :${this.customer.address}</br>
          Telefono  :${this.customer.phone}</br>
      </p>
    </div>
  </div>`;
  }
  setLineDetailsDoc() {
    this.docLineDetails = '';
    this.totalTareWeight = 0;
    this.totalGrossWeight = 0;
    for (const [key, element] of this.lineDetails.entries()) {
      this.totalTareWeight += (element.tareWeight ? element.tareWeight : 0);
      this.totalGrossWeight += (element.grossWeight ? element.grossWeight : 0);
      this.docLineDetails += `<tr class="linedetails">
    <td class="tableitem"><p class="itemtext">${key + 1}</p></td>
    <td class="tableitem"><p class="itemtext">${((element.tareWeight ? element.tareWeight.toLocaleString('en-US') : ''))}</p></td>
    <td class="tableitem"><p class="itemtext">${((element.grossWeight ? element.grossWeight.toLocaleString('en-US') : ''))}</p></td>
    </tr>`;
    }
    this.docLineDetails += `<tr class="tabletitle">
    <td class="number">Total Lbs</td>
    <td class="item"><h2>${(this.totalTareWeight.toLocaleString('en-US'))}</h2></td>
    <td class="item"><h2>${(this.totalGrossWeight.toLocaleString('en-US'))}</h2></td>
    </tr>
    <tr class="tabletitle">
    <td class="number">Peso Neto Total:</td>
    <td class="item"><h2>${(Math.abs(+this.totalTareWeight.toFixed(2) -
      +this.totalGrossWeight.toFixed(2)).toLocaleString('en-US'))}</h2>
    </tr>
    <tr class="tabletitle">
    <td class="number">Total RD$</td>
    <td class="item"><h2>${((Math.abs(this.totalTareWeight -
      this.totalGrossWeight) * this.invoice.pricePounds ).toLocaleString('en-US'))}</h2>
    </tr>
    </table>
    </div>`;
  }

  setPrinter() {
    const options: PrintOptions = {
      name: 'Factura',
      duplex: false,
      landscape: false,
      grayscale: true
    };
    this.docMiddle = `<div id="legalcopy" class="info">
    <p>Cantidad de pollos: ${this.invoice.lotProduct}</br>
    Precio por libra RD$: ${(this.invoice.pricePounds.toLocaleString('en-US'))}</br>
    Promedio: ${(Math.abs(this.totalTareWeight -
      this.totalGrossWeight / this.invoice.lotProduct).toFixed(6))}
    </p>
    </div>
    <div id="bot">
  <center><h3>Detalle</h3></center>
  <div id="table">
    <table>
      <tr class="tabletitle">
        <td class="number"><h2>No.</h2></td>
        <td class="item"><h2>Tara</h2></td>
        <td class="item"><h2>Peso Bruto</h2></td>
      </tr>`;

    this.docInfoInvoice = `<div id="legalcopy">
    <p class="legal">FacturaID: ${this.invoice.id}</br>
Fecha: ${this.invoice.date}</br>
Metodo de pago: ${this.invoice.paymentMethod}</br>
Numero de placa: ${this.invoice.licensePlate}</br>
UsuarioID: ${this.invoice.user}</br>
</p>
</div>
</div>
</div>`;

    const page = (this.docStyles + this.docHeader + this.docInfoCustomer + this.docMiddle +
      this.docLineDetails + this.docInfoInvoice + this.docFooter);
    this.printer.print(page, options).then(() => {
      this.loadingController.dismiss();
    }, err => {
      this.loadingController.dismiss();
      this.toastService.presentErrorToast('No se ha podido imprimir la factura, revise los campos nuevamente.');
      console.log('printer error: ', err);
    });

  }
  searchCustomer(customerID) {
    return this.customerService.getCustomerName(customerID).then(data => {
      this.customer = data;
    });
  }
  searchLineDetails(invoiceID) {
    return this.invoiceDetailsService.getLineDetails(invoiceID).then(data => {
      this.lineDetails = data;
    });
  }

}
