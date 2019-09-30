import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { InvoicesReportService } from 'src/app/services/invoices-report.service';
@Component({
  selector: 'app-invoices-report',
  templateUrl: './invoices-report.page.html',
  styleUrls: ['./invoices-report.page.scss'],
})
export class InvoicesReportPage implements OnInit {
  resultReport = {
    lotProduct: 0,
    netWeight: 0,
    totalImport: 0,
    generalAverage: 0,
    totalInvoices: 0
  };
  firstDate: string;
  secondDate: string;
  maxDate: string;
  date;
  constructor(private toastService: ToastService, private invoicesReportService: InvoicesReportService) {
   }

  ngOnInit() {
    this.date = new Date();
    this.maxDate = new Date(this.date.getTime() -
    this.date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    this.firstDate = new Date(this.date.getTime() -
    this.date.getTimezoneOffset() * 60000).toISOString();
    this.secondDate = new Date(this.date.getTime() -
    this.date.getTimezoneOffset() * 60000).toISOString();
    this.getData();
  }

  getData() {
    this.invoicesReportService.getData(this.firstDate.split('T')[0],
      this.secondDate.split('T')[0]).then(data => {
       this.resultReport = data;
    });
  }

}
