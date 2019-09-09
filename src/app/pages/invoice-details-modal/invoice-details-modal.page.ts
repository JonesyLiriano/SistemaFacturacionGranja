import { Component, OnInit, Input } from '@angular/core';
import { Invoice } from 'src/app/models/invoice';
import { ModalController } from '@ionic/angular';
import { InvoiceDetails } from 'src/app/models/invoice-details';
import { Customer } from 'src/app/models/customer';
import { CustomersService } from 'src/app/services/customers.service';
import { InvoicesService } from 'src/app/services/invoices.service';

@Component({
  selector: 'app-invoice-details-modal',
  templateUrl: './invoice-details-modal.page.html',
  styleUrls: ['./invoice-details-modal.page.scss'],
})
export class InvoiceDetailsModalPage implements OnInit {
  @Input() invoice: Invoice;
  customer: Customer;
  lineDetails: InvoiceDetails[];
  totalTare: number;
  totalGross: number;
  totalNetWeight: number;
  average: number;
  constructor(private modalController: ModalController, private customerService: CustomersService,
              private invoiceService: InvoicesService) { }

  ngOnInit() {
    this.getCustomerName();
    this.getLineDetails();
  }

  dismissModal() {
    if (this.modalController) {
      this.modalController.dismiss().then(() => { this.modalController = null; });
    }
  }
  getCustomerName() {
   this.customerService.getCustomerName(this.invoice.customer).then(data => {
     this.customer = data;
   });
  }

  getLineDetails() {
    this.invoiceService.getLineDetails(this.invoice.id).then(data => {
      this.lineDetails = data;
      this.setResult();
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

