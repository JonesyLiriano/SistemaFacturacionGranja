import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Promise<boolean> {
    // tslint:disable-next-line: no-shadowed-variable;
    return this.checkLogin();
  }
  // tslint:disable-next-line: no-shadowed-variable
  checkLogin() {
    return this.loginService.validateSession().then(validation => {
      if (validation) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    });
  }
}
