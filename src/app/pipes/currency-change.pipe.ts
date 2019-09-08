import { Pipe, PipeTransform } from '@angular/core';
import { isNumber } from 'util';

@Pipe({
  name: 'currencyChange'
})
export class CurrencyChangePipe implements PipeTransform {

    transform(value: any) {
      return isNumber(value) ? 'RD$' + value.toFixed(2) : '';
    }

}
