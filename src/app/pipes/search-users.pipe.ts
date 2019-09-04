import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchUsers'
})
export class SearchUsersPipe implements PipeTransform {

  transform(items: any[], search: string): any {
    if (!items || !search) {
      return items;
    }
    return items.filter(item =>
      item.username.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
      item.id.toLowerCase().indexOf(search.toLowerCase()) !== -1 );
  }

}
