import { LoadingController } from '@ionic/angular';
import { InvoiceDetails } from './../models/invoice-details';
import { Invoice } from './../models/invoice';
import { commands } from './../mocks/printer-commands';
import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { Customer } from '../models/customer';
import { CustomersService } from './customers.service';
import { InvoicesService } from './invoices.service';

@Injectable({
  providedIn: 'root'
})
export class BluetoothSerialService {

  printerMac = '00:13:7B:49:CF:67';
  invoice: Invoice;
  lineDetails: InvoiceDetails[];
  customer: Customer;
  totalTareWeight = 0;
  totalGrossWeight = 0;
  docLineDetails;

  constructor(private bluetoothSerial: BluetoothSerial,
              private loadingController: LoadingController,
              private customerService: CustomersService,
              private invoiceDetailsService: InvoicesService) { }
  
  bluetoothConnect(invoice: Invoice) {
    this.bluetoothSerial.isEnabled().then(() => {
      this.bluetoothSerial.connect(this.printerMac).subscribe(() => {
        this.presentLoading('Favor esperar mientras se imprime la factura');
        this.setupPrinter(invoice);
      }, (failed) => this.connectedFailed(failed));
    }, err => alert('Encienda el bluetooth por favor...'));
    
  }

  setupPrinter(invoice: Invoice) {
    this.invoice = invoice;    
    this.searchCustomer(this.invoice.customer).then();
    this.searchLineDetails(this.invoice.id).then(() => {
      this.setLineDetailsDoc();
      this.printInvoice();
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

  setLineDetailsDoc() {
    this.docLineDetails = '';
    this.totalTareWeight = 0;
    this.totalGrossWeight = 0;
    for (const [key, element] of this.lineDetails.entries()) {
      this.totalTareWeight += (element.tareWeight ? element.tareWeight : 0);
      this.totalGrossWeight += (element.grossWeight ? element.grossWeight : 0);
      this.docLineDetails += (key + 1).toString().padEnd(8) + ((element.tareWeight ? element.tareWeight.toLocaleString('en-US').padEnd(10) : ''.padEnd(10)))
    + ((element.grossWeight ? element.grossWeight.toLocaleString('en-US') : '')) + commands.EOL;
    
  }
}


  printInvoice() {
    let receipt = '';
    receipt += commands.HARDWARE.HW_INIT;
    receipt += commands.TEXT_FORMAT.TXT_4SQUARE;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
    receipt += 'GRANJA Y & G';
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
    receipt += 'Azua';
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
    receipt += 'Tel: 809-835-9817';
    receipt += commands.EOL;
    receipt += commands.HORIZONTAL_LINE.HR1_58MM;
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += commands.TEXT_FORMAT.TXT_HEIGHT[5];
    receipt += commands.TEXT_FORMAT.TXT_BOLD_ON;
    receipt += this.customer.name;
    receipt += commands.TEXT_FORMAT.TXT_BOLD_OFF;
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += this.customer.address;
    receipt += commands.EOL;
    receipt += commands.HORIZONTAL_LINE.HR_58MM;
    receipt += commands.EOL;
    receipt += 'Cantidad de pollos: ' + this.invoice.lotProduct;
    receipt += commands.EOL;
    receipt += 'Precio por libra RD$: ' + (this.invoice.pricePounds.toLocaleString('en-US'));
    receipt += commands.EOL;
    receipt += 'Promedio: ' + (Math.abs((this.totalTareWeight -
      this.totalGrossWeight) / this.invoice.lotProduct).toFixed(6));
    receipt += commands.EOL;
    receipt += commands.HORIZONTAL_LINE.HR_58MM;
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_HEIGHT[7];
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
    receipt += 'DETALLE';
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_BOLD_ON;
    receipt += commands.HORIZONTAL_LINE.HR1_58MM;
    receipt += 'No.     Tara      Peso Bruto    ';
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_BOLD_OFF;
    receipt += commands.HORIZONTAL_LINE.HR_58MM;
    receipt += commands.EOL;
    receipt += this.docLineDetails;
    receipt += commands.HORIZONTAL_LINE.HR_58MM;
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_BOLD_ON;
    receipt += 'Total:'.padEnd(8) + (this.totalTareWeight.toLocaleString('en-US')).padEnd(10) +
    (this.totalGrossWeight.toLocaleString('en-US'));    
    receipt += commands.EOL;    
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_RT;
    receipt += 'Peso Neto Total Lbs: ' + (Math.abs(+this.totalTareWeight.toFixed(2) -
    +this.totalGrossWeight.toFixed(2)).toLocaleString('en-US'));
    receipt += commands.EOL;
    receipt += 'Total RD$: ' + (Math.abs(this.totalTareWeight -
      this.totalGrossWeight) * this.invoice.pricePounds ).toLocaleString('en-US');
    receipt += commands.TEXT_FORMAT.TXT_BOLD_OFF;
    receipt += commands.EOL;
    receipt += commands.HORIZONTAL_LINE.HR1_58MM;
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += 'FacturaID: ' +  this.invoice.id;
    receipt += commands.EOL;
    receipt += 'Fecha: ' + this.invoice.date;
    receipt += commands.EOL;
    receipt += 'Metodo de pago:' + 'N/A';
    receipt += commands.EOL;
    receipt += 'Numero de placa: ' + this.invoice.licensePlate;
    receipt += commands.EOL;
    receipt += 'UsuarioID:' + this.invoice.user;
    receipt += commands.EOL;
    receipt += commands.HORIZONTAL_LINE.HR_58MM;
    receipt += commands.EOL;
    receipt += commands.EOL;
    receipt += commands.EOL;
    receipt += commands.HORIZONTAL_LINE.HR_58MM;
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
    receipt += 'Recibido conforme';
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_BOLD_ON;
    receipt += commands.HORIZONTAL_LINE.HR2_58MM;    
    receipt += commands.EOL;
    receipt += 'Gracias por su compra!';
    receipt += commands.TEXT_FORMAT.TXT_BOLD_OFF;
    receipt += commands.EOL;
    receipt += 'Sistema realizado por:';
    receipt += commands.EOL;
    receipt += 'Jonesy Liriano Tel: 809-222-3740';
    //secure space on footer
    receipt += commands.EOL;

    this.bluetoothSerial.write(receipt).then(() => {
      this.loadingController.dismiss();
      alert('Factura impresa');
    }, (err) => {
      this.loadingController.dismiss();
      alert('Hubo un error al imprimir ' + err );
    });
  }

  connectedFailed(failed) {
    this.loadingController.dismiss();
    alert('Printer no pudo ser conectado: ' + failed);
  }
  async presentLoading(msg) {
    const loading = await this.loadingController.create({
      message: msg
    });
    return await loading.present();
  }

}
