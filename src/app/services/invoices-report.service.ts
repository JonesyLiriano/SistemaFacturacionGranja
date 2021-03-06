import { Injectable } from '@angular/core';
import { SqliteDataService } from './sqlite-data.service';

@Injectable({
  providedIn: 'root'
})
export class InvoicesReportService {
  resultReport = {
    lotProduct: 0,
    netWeight: 0,
    totalImport: 0,
    totalInvoices: 0
  };
  query = `SELECT (SELECT SUM(lotProduct) FROM invoices WHERE DATE(substr(date,7,4)
           ||'-'||substr(date,4,2) ||'-' ||substr(date,1,2)) BETWEEN DATE(?) AND DATE(?)) as lotProduct,
           SUM(ifnull(ide.grossWeight, 0) - ifnull(ide.tareWeight, 0))
           as netWeight, SUM((ifnull(ide.grossWeight, 0) - ifnull(ide.tareWeight, 0)) * i.pricePounds) as totalImport,
           COUNT(DISTINCT i.id) as totalInvoices FROM invoices i Inner Join invoicedetails ide
           On ide.invoice = i.id WHERE DATE(substr(i.date,7,4)
           ||'-'
           ||substr(i.date,4,2)
           ||'-'
           ||substr(i.date,1,2))
           BETWEEN DATE(?) AND DATE(?);`;

  constructor(private sqlData: SqliteDataService) { }

  getData(startDate, endDate) {
    return this.sqlData.condicionalQuery(this.query, [startDate, endDate, startDate, endDate]).then(data => {
      if (data.rows.length > 0) {
        return this.resultReport = data.rows.item(0);
      }
    });
  }
}
