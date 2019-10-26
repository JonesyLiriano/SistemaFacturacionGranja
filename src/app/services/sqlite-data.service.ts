import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastService } from './toast.service';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { File } from '@ionic-native/file/ngx';
import { FirebaseService } from './firebase.service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@Injectable({
  providedIn: 'root'
})
export class SqliteDataService {

  dbName = 'SFacturacionGranja.db';
  database: any;

  readonly usersTable = `CREATE TABLE IF NOT EXISTS  users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    level TEXT NOT NULL)`;
  readonly customersTable = `CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    address TEXT NOT NULL,
    phone TEXT NOT NULL)`;

  readonly invoicesTable = `CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY,
        customer INTEGER NOT NULL,
        pricepounds REAL NOT NULL,
        licenseplate TEXT NOT NULL,
        paymentmethod TEXT NOT NULL,
        lotproduct REAL NOT NULL,
        date TEXT NOT NULL,
        user INTEGER NOT NULL,
        FOREIGN KEY(customer) REFERENCES customers(id),
        FOREIGN KEY(user) REFERENCES users(id))`;

  readonly invoiceDetailsTable = `CREATE TABLE IF NOT EXISTS invoicedetails (
        id INTEGER PRIMARY KEY,
        invoice INTEGER NOT NULL,
        tareweight REAL,
        grossweight REAL,
        FOREIGN KEY(invoice) REFERENCES invoices(id))`;

  readonly insertAdminUser = `INSERT OR IGNORE INTO users (username, password, level)
        VALUES ('Admin', 'admin', 'admin')`;

  databaseReady: BehaviorSubject<boolean>;
  

  constructor(private platform: Platform, private sqlite: SQLite, private toastService: ToastService,
              private sqlitePorter: SQLitePorter, private file: File, private firebaseService: FirebaseService,
              private transfer: FileTransfer) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.createDB();
  });
}

  getDataBaseState() {
    return this.databaseReady.asObservable();
  }

  createDB() {
    this.sqlite.create({name: this.dbName, location: 'default'}).then((db: SQLiteObject) => {
      this.database = db;
      this.createTables();
      this.database.executeSql(this.insertAdminUser, {});
      this.databaseReady.next(true);
});
  }

   async createTables() {
    try {
        await this.database.executeSql(this.usersTable, {}).then(res => {
        }, err => {
          console.log ('ERROR Q:', err);
        });
        await this.database.executeSql(this.customersTable, {}).then(res => {
        }, err => {
          console.log ('ERROR Q:', err);
        });
        await this.database.executeSql(this.invoicesTable, {}).then(res => {
        }, err => {
          console.log ('ERROR Q:', err);
        });
        await this.database.executeSql(this.invoiceDetailsTable, {}).then(res => {
        }, err => {
          console.log ('ERROR Q:', err);
        });
    } catch (e) {
        console.log('Error !', e);
    }
  }
  public create(tableName, item) {
    let sqlText;
    let values ;
    switch (tableName) {
        case 'users':
            sqlText = 'INSERT INTO users (username, password, level) VALUES (?, ?, ?)';
            values = [item.username || null , item.password || null, item.level || null];
            break;
        case 'customers':
            sqlText = 'INSERT INTO customers (name, address, phone) VALUES (?, ?, ?)';
            values = [item.name || null, item.address || null ,  item.phone || null];
            break;
        case 'invoices':
            sqlText = `INSERT INTO invoices (customer, pricepounds ,licenseplate, paymentmethod, lotproduct, date, user)
             VALUES (?, ?, ?, ?, ?, ?, ?)`;
            values = [item.customer || null , item.pricePounds || null, item.licensePlate || null , item.paymentMethod ||
              null, item.lotProduct || null , item.date || null , item.user || null];
            break;
        case 'invoicedetails':
            sqlText = 'INSERT INTO invoicedetails (invoice, tareweight, grossweight) VALUES (?, ?, ?)';
            values = [item.invoice || null , item.tareWeight || null, item.grossWeight || null];
            break;
        default :
        return ;

    }
    return this.database.executeSql(sqlText, values).then( success => {
      this.toastService.presentSuccessToast('El registro ha sido creado correctamente!');
    }, err => {
      this.toastService.presentErrorToast('Ha ocurrido un error!, intentelo de nuevo...');
      console.log('insert error:', err);
    });
  }
  public update(tableName, item) {
    let sqlText;
    let values ;
    switch (tableName) {
        case 'users':
            sqlText = 'UPDATE users SET (password, level ) = (?, ?) where id = ?';
            values = [item.password || null , item.level || null, item.id];
            break;
        case 'customers':
            sqlText = 'UPDATE customers SET (address, phone) = (?, ?) where id = ?';
            values = [item.address || null ,  item.phone || null , item.id];
            break;
        default :
        return ;

    }
    return this.database.executeSql(sqlText, values).then(() => {
      this.toastService.presentSuccessToast('El registro ha sido actualizado correctamente!');
    }, () => {
      this.toastService.presentErrorToast('Ha ocurrido un error!, intentelo de nuevo...');
    });
}

public remove(tableName, item) {
  let sqlText;
  let values ;
  sqlText = `delete from ${tableName} where id = ?`;
  values = [item.id || null ];
  return this.database.executeSql(sqlText, values).then(() => {
    this.toastService.presentSuccessToast('El registro fue eliminado correctamente!');
  }, () => {
    this.toastService.presentErrorToast('Ha ocurrido un error!, intentelo de nuevo...');
 
  });
}

public list(tableName) {
  let sqlText;
  const values = [];
  sqlText = `select * from ${tableName}`;

  return this.database.executeSql(sqlText, values).then(res => {
    return res;
  }, err => {
    console.log(err, 'ERROR LIST QUERY');
    return [];
  });
}

public condicionalQuery(query, values) {
  let sqlText;
  sqlText = query;

  return this.database.executeSql(sqlText, values).then(res => {
    return res;
  }, err => {
    console.log(err, 'ERROR LIST QUERY');
    return [];
  });
}

public exportDBtoSQL() {
  return this.sqlitePorter.exportDbToSql(this.database._objectInstance).then((data) => {
    return this.firebaseService.uploadScriptBackUp(data);
  }, err => {
    alert(err);
    this.toastService.presentErrorToast('Ha ocurrido un error creando el respaldo de la base de datos');
  })
}

private populateDB(data: string) {
  return this.sqlitePorter.importSqlToDb(this.database._objectInstance, data).then(() => {
    this.toastService.presentSuccessToast('La base de datos ha sido restaurada.');
  }, err => {
    alert(err);
    this.toastService.presentErrorToast('Ha ocurrido un error restaurando la base de datos');
  });
}

public importSQLtoDB() {
  return this.platform.ready().then(() => {
    return this.firebaseService.downloadScriptBackUp().then(url => {
      const fileTransfer: FileTransferObject = this.transfer.create();
      return fileTransfer.download(url, this.file.externalDataDirectory + 'ScriptBackupY&G.txt').then((entry) => {
        return this.file.readAsText(this.file.externalDataDirectory, 'ScriptBackupY&G.txt' ).then((data) => {
          this.populateDB(data);
        }, err => {
          alert(err);
          this.toastService.presentErrorToast('Ha ocurrido un error leyendo el respaldo de la base de datos.');
        });      
      });
      }, (error) => {
        alert(error);
      });
    })
      
}
}
