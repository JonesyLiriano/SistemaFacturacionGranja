import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast.service';
@Component({
  selector: 'app-invoices-report',
  templateUrl: './invoices-report.page.html',
  styleUrls: ['./invoices-report.page.scss'],
})
export class InvoicesReportPage implements OnInit {

  firstDate: string;
  secondDate: string;
  maxDate: string;
  constructor(private toastService: ToastService) {
   }

  ngOnInit() {
    this.maxDate = new Date().toISOString().split('T')[0];
    this.firstDate = new Date().toISOString();
    this.secondDate = new Date().toISOString();
  }

}
