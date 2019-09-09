import { Injectable } from '@angular/core';
import { Subject, Subscription, Observable } from 'rxjs';
import { SqliteDataService } from './sqlite-data.service';
import { ToastService } from './toast.service';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  response = false;
  response$: Promise<boolean>;
  validation = false;
  validation$: Promise<boolean>;
  constructor(private sqlData: SqliteDataService, private storage: Storage,
              private toastService: ToastService) {
  }

  confirmUser(user): Promise<boolean> {
    // tslint:disable-next-line: deprecation
    // tslint:disable-next-line: no-shadowed-variable
    return this.response$ = new Promise(resolve => {
      this.sqlData.databaseReady.subscribe(state => {
      if (state) {
        this.sqlData.condicionalQuery(`Select * FROM users WHERE username = ? and
        password = ?`, [user.username, user.password]).then( data => {
          if (data.rows.length > 0) {
            this.createSession(data);
            this.toastService.presentSuccessToast('Se ha logeado correctamente!');
            this.response = true;
          } else {
            this.toastService.presentErrorToast('Ingreso fallido, favor intentar nuevamente...');
            this.response = false;
          }
          resolve(this.response);
        });
      }
    });
  });
  }

  createSession(data) {
    this.storage.set('userID', data.rows.item(0).id);
    this.storage.set('level', data.rows.item(0).level);
  }

  validateSession() {
     return this.storage.get('userID').then(data => {
      if (data) {
        return true;
        } else {
          return false;
        }
      });

  }

  validateAdminSession() {
    return this.storage.get('level').then(data => {
      if (data === 'admin') {
        return true;
      } else {
        return false;
      }
    });
    }

  closeSession() {
    this.storage.get('userID').then(data => {
      if (data) {
        this.storage.clear().then(() =>
        this.toastService.presentDefaultToast('Se ha cerrado la session...'));
      }
    });
  }
}
