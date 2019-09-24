import { Pipe, PipeTransform } from '@angular/core';
import { Invoice } from '../models/invoice';

@Pipe({
  name: 'searchInvoices'
})
export class SearchInvoicesPipe implements PipeTransform {

  transform(items: Invoice[], search: string): any {
    if (!items || !search) {
      return items;
    }
    return items.filter(item =>
      item.customer.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
      item.id.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
      item.date.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
    );
  }

}
