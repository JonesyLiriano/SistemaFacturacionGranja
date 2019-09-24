import { Component, OnInit } from '@angular/core';
import { InvoiceDetailsModalPage } from '../invoice-details-modal/invoice-details-modal.page';
import { Invoice } from 'src/app/models/invoice';
import { ModalController, AlertController } from '@ionic/angular';
import { InvoicesService } from 'src/app/services/invoices.service';
import { PrintService } from 'src/app/services/print.service';


@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.page.html',
  styleUrls: ['./invoices.page.scss'],
})
export class InvoicesPage implements OnInit {
  invoice: Invoice;
  invoices: Invoice[];
  search;

  constructor(private modalController: ModalController, private alertController: AlertController,
              private invoiceService: InvoicesService, private printerService: PrintService) {}

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
   this.invoiceService.getInvoices().subscribe(data => {
    this.invoices = data;
   });
  }

  async presentReadModal(invoice: Invoice) {
    const modal = await this.modalController.create({
    component: InvoiceDetailsModalPage,
    componentProps: { invoice }
  });

    await modal.present();
  }
  printInvoice(invoice) {
    this.printerService.print(invoice);
  }

  onFilter(search: string) {
    this.search = search;
}
}
