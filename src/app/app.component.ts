import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
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
      title: 'Salir',
      url: '/login',
      icon: 'log-out'
    }

  ];
  public activeNav = true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private loginService: LoginService
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.loginService.activeNav$.subscribe(show => {
      this.activeNav = show;
  });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
}
}
