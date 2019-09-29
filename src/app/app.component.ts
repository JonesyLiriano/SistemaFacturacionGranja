import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public appPages = [
    {
      title: 'Home',
      url: '/billing',
      icon: 'home'
    },
    {
      title: 'Facturas',
      url: '/invoices',
      icon: 'paper'
    },
    {
      title: 'Clientes',
      url: '/customers',
      icon: 'people'
    },
    {
      title: 'Usuarios',
      url: '/users',
      icon: 'contacts'
    },
    {
      title: 'Reporte de ventas',
      url: '/invoices-report',
      icon: 'stats'
    },
    {
      title: 'Copia de Seguridad',
      url: '/dBUpdate',
      icon: 'cloud-upload'
    },
    {
      title: 'Salir',
      url: '/login',
      icon: 'log-out'
    }

  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  ngOnInit() {
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#1976d2');
      this.splashScreen.hide();
    });
}
}
