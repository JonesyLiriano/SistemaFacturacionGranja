import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  public showPassword: boolean;
  constructor(private loginService: LoginService, private router: Router, public menuCtrl: MenuController) {
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

  onSubmit() {
  this.loginService.confirmUser(this.user).then(response => {
    if (response) {
      this.menuCtrl.enable(true);
      this.router.navigate(['/billing']);
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
