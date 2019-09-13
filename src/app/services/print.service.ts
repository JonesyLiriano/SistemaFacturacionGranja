import { Injectable } from '@angular/core';
import { Printer, PrintOptions } from '@ionic-native/printer/ngx';
import { LoadingController } from '@ionic/angular';
import { Invoice } from '../models/invoice';
import { NgForOf } from '@angular/common';
import { InvoiceDetails } from '../models/invoice-details';
import { Customer } from '../models/customer';
import { SqliteDataService } from './sqlite-data.service';
import { CustomersService } from './customers.service';
import { InvoicesService } from './invoices.service';
import { docStyles } from '../mocks/stylesReceipt';

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
<p class="legal"><strong>Gracias por su compra!</strong>.</br>
Sistema realizado por Jonesy Liriano</br>
Tel: 809-222-3740
</p>
</div>
</div>
</div>`;

  constructor(private printer: Printer, private loadingController: LoadingController,
              private customerService: CustomersService,
              private invoiceDetailsService: InvoicesService) {

  }
  async presentLoading(msg) {
    const loading = await this.loadingController.create({
      message: msg
    });
    return await loading.present();
  }

  print(invoice: Invoice) {
    this.presentLoading('Favor esperar mientras se imprime la factura');
    this.searchCustomer(invoice.customer).then(() => {
      this.setCustomerDoc();
    });
    this.searchLineDetails(invoice.id).then(() => {
      this.setLineDetailsDoc();
      this.setPrinter(invoice);
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
      this.totalTareWeight += element.tareWeight;
      this.totalGrossWeight += element.grossWeight;
      this.docLineDetails += `<tr class="linedetails">
    <td class="tableitem"><p class="itemtext">${key + 1}</p></td>
    <td class="tableitem"><p class="itemtext">${element.tareWeight}</p></td>
    <td class="tableitem"><p class="itemtext">${element.grossWeight}</p></td>
    </tr>`;
    }
    this.docLineDetails += `<tr class="tabletitle">
    <td class="number">Total</td>
    <td class="item"><h2>${this.totalTareWeight}</h2></td>
    <td class="item"><h2>${this.totalGrossWeight}</h2></td>
    </tr>
    </table>
    </div>`;
  }

  setPrinter(invoice: Invoice) {
    const options: PrintOptions = {
      name: 'Factura',
      duplex: false,
      landscape: false,
      grayscale: true
    };
    this.docMiddle = `<div id="legalcopy" class="info">
    <p>Cantidad de pollos: ${invoice.lotProduct}</br>
    Precio por libra: ${invoice.pricePounds}</br></p>
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
    <p class="legal">FacturaID: ${invoice.id}</br>
Fecha: ${invoice.date}</br>
Metodo de pago: ${invoice.paymentMethod}</br>
Numero de placa: ${invoice.licensePlate}</br>
UsuarioID: ${invoice.user}</br>
</p>
</div>
</div>
</div>`;
    const page = (this.docStyles + this.docHeader + this.docInfoCustomer + this.docMiddle +
      this.docLineDetails + this.docInfoInvoice + this.docFooter);
    this.printer.print(page, options).then(() => {
      this.loadingController.dismiss();
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
