import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { MenuController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  public showPassword: boolean;
  constructor(private loginService: LoginService, private router: Router,
              public menuCtrl: MenuController, private loadingController: LoadingController) {
  }
  user: User;
  ngOnInit() {
    this.loginService.closeSession();
    this.menuCtrl.enable(false);
    this.showPassword = false;
    this.user = {
      id: null,
      username: '',
      password: '',
      level: ''
    };
  }
  async presentLoading(msg) {
    const loading = await this.loadingController.create({
      message: msg
    });
    return await loading.present();
  }
  onSubmit() {
    this.loginService.confirmUser(this.user).then(response => {
      if (response) {
        this.presentLoading('Cargando, por favor espere...').then(() => {
          this.menuCtrl.enable(true);
          this.router.navigate(['/billing']);
        });
      } else {
        this.user = {
          id: null,
          username: '',
          password: '',
          level: ''
        };
      }
    });
  }

  ngOnDestroy() {
  }
}
