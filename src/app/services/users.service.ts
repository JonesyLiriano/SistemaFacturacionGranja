import { Injectable } from '@angular/core';
import { SqliteDataService } from './sqlite-data.service';
import { User } from '../models/user';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private users$: Subject<any>;

  constructor(private sqlData: SqliteDataService) {
    this.users$ = new Subject();
  }

  getUsers() {
    this.sqlData.databaseReady.subscribe(state => {
      if (state) {
        this.sqlData.list('users').then( data => {
          if (data.rows.length > 0) {
            const users: User[] = [];
            for (let i = 0; i < data.rows.length; i++) {
            users.push({id: data.rows.item(i).id,
              username: data.rows.item(i).username,
              password: data.rows.item(i).password,
              level: data.rows.item(i).level});
          }
            this.users$.next(users);
        }
         });
      }
    });
    return this.users$.asObservable();
  }

  createUser(user: User) {
    this.sqlData.create('users', user);
  }

  updateUser(user: User) {
    return this.sqlData.update('users', user);
  }

  deleteUser(user: User) {
    return this.sqlData.remove('users', user);
  }
}
