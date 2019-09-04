import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchInvoices'
})
export class SearchInvoicesPipe implements PipeTransform {

  transform(items: any[], search: string): any {
    if (!items || !search) {
      return items;
    }
    return items.filter(item =>
      item.customer.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
      item.id.toLowerCase().indexOf(search.toLowerCase()) !== -1 );
  }

}
