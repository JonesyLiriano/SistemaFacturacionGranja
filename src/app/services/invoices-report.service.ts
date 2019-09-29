import { Injectable } from '@angular/core';
import { SqliteDataService } from './sqlite-data.service';

@Injectable({
  providedIn: 'root'
})
export class InvoicesReportService {

  constructor(private sqlData: SqliteDataService) { }
}
