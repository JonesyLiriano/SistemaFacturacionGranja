import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SqliteDataService } from './sqlite-data.service';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private customers$: Subject<any>;

  constructor(private sqlData: SqliteDataService) {
    this.customers$ = new Subject();
  }

  getCustomers() {
    this.sqlData.databaseReady.subscribe(state => {
      if (state) {
        this.sqlData.list('customers').then( data => {
          if (data.rows.length > 0) {
            const customers: Customer[] = [];
            for (let i = 0; i < data.rows.length; i++) {
            customers.push({id: data.rows.item(i).id,
              name: data.rows.item(i).name,
              address: data.rows.item(i).address,
              phone: data.rows.item(i).phone});
          }
            this.customers$.next(customers);
        }
         });
      }
    });
    return this.customers$.asObservable();
  }

  createCustomer(customer: Customer) {
    this.sqlData.create('customers', customer);
  }

  updateCustomer(customer: Customer) {
    return this.sqlData.update('customers', customer);
  }

  deleteCustomer(customer: Customer) {
    return this.sqlData.remove('customers', customer);
  }

  getCustomerName(id: number) {
    return this.sqlData.condicionalQuery('Select * from customers WHERE id = ?', [id]).then(data => {
      let customer: Customer;
      if (data.rows.length > 0) {
      return customer = data.rows.item(0);
      }
    });
  }

}
