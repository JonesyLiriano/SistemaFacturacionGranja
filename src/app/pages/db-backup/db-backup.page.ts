import { SqliteDataService } from './../../services/sqlite-data.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-db-backup',
  templateUrl: './db-backup.page.html',
  styleUrls: ['./db-backup.page.scss'],
})
export class DbBackupPage implements OnInit {

  constructor(private sqliteDataService: SqliteDataService, private loadingController: LoadingController,
              private alertController: AlertController) { }

  ngOnInit() {
  }
  async presentLoading(msg) {
    const loading = await this.loadingController.create({
      message: msg
    });
    return await loading.present();
  }

  async presentAlertExportConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirmacion!',
      message: 'Esta seguro que desea realizar el <strong>respaldo</strong> de la base de datos?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Aceptar',
          handler: () => {
            this.exportDB();
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertImportConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirmacion!',
      message: 'Esta seguro que desea <strong>restaurar</strong> de la base de datos?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Aceptar',
          cssClass: 'danger',
          handler: () => {
            this.importDB();
          }
        }
      ]
    });

    await alert.present();
  }
  exportDB() {
    this.presentLoading('Por favor espere...');
    this.sqliteDataService.exportDBtoSQL().then(() => {
      this.loadingController.dismiss();
    }, () => {
      this.loadingController.dismiss()
    });
  }

  importDB() {
    this.presentLoading('Por favor espere...');
    this.sqliteDataService.importSQLtoDB().then(() => {
      this.loadingController.dismiss();
    }, () => {
      this.loadingController.dismiss()
    });
  }

}
