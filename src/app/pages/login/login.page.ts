import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  public showPassword: boolean;
  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
    this.showPassword = false;
    this.loginService.setActiveNav(false);
  }

  onSubmit(from: any) {
    this.router.navigate(['/customers']);
    this.loginService.setActiveNav(true);
  }

  ngOnDestroy() { }
}
