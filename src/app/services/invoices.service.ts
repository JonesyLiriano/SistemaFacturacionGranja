import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SqliteDataService } from './sqlite-data.service';
import { Invoice } from '../models/invoice';
import { InvoiceDetails } from '../models/invoice-details';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {

  private invoices$: Subject<any>;

  constructor(private sqlData: SqliteDataService, private toastService: ToastService) {
    this.invoices$ = new Subject();
  }

  getInvoices() {
    this.sqlData.databaseReady.subscribe(state => {
      if (state) {
        this.sqlData.condicionalQuery('Select * from invoices order by id desc', []).then(data => {
          if (data.rows.length > 0) {
            const invoices: Invoice[] = [];
            for (let i = 0; i < data.rows.length; i++) {
              invoices.push({
                id: data.rows.item(i).id,
                customer: data.rows.item(i).customer,
                pricePounds: data.rows.item(i).pricepounds,
                licensePlate: data.rows.item(i).licenseplate,
                paymentMethod: data.rows.item(i).paymentmethod,
                lotProduct: data.rows.item(i).lotproduct,
                date: data.rows.item(i).date,
                user: data.rows.item(i).user
              });
            }
            this.invoices$.next(invoices);
          }
        });
      }
    });
    return this.invoices$.asObservable();
  }

  createInvoice(invoice: Invoice) {
    this.sqlData.create('invoices', invoice);
  }
  createInvoiceDetails(invoiceDetails: InvoiceDetails) {
    this.sqlData.create('invoicedetails', invoiceDetails);
  }

  getLastInvoiceID() {
    return this.sqlData.condicionalQuery('SELECT last_insert_rowid() as lastInvoiceID', []).then(data => {
      if (data.rows.length > 0) {
        return data.rows.item(0).lastInvoiceID;
      }
    });
  }

  getLineDetails(id: number) {
    return this.sqlData.condicionalQuery('Select * from invoicedetails WHERE invoice = ?', [id]).then(data => {
      if (data.rows.length > 0) {
        const lineDetails: InvoiceDetails[] = [];
        for (let i = 0; i < data.rows.length; i++) {
          lineDetails.push({
            id: data.rows.item(i).id,
            invoice: data.rows.item(i).invoice,
            tareWeight: data.rows.item(i).tareweight,
            grossWeight: data.rows.item(i).grossweight
          });
        }
        return lineDetails;
      }
    });
  }
}

