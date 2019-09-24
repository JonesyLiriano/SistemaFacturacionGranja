import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user';

@Pipe({
  name: 'searchUsers'
})
export class SearchUsersPipe implements PipeTransform {

  transform(items: User[], search: string): any {
    if (!items || !search) {
      return items;
    }
    return items.filter(item =>
      item.username.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
      item.id.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
    );
  }
}
