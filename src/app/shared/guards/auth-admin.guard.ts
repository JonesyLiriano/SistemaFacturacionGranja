import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { ToastService } from 'src/app/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuard implements CanActivate  {

  constructor(private loginService: LoginService, private router: Router, private toastService: ToastService) { }
  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Promise<boolean> {
// tslint:disable-next-line: no-shadowed-variable

return this.checkLogin();
}

// tslint:disable-next-line: no-shadowed-variable
checkLogin() {
return this.loginService.validateAdminSession().then(validation => {
  if (validation) {
    return true;
  } else {
    this.toastService.presentErrorToast('No tiene acceso para entrar en el modulo de usuario');
    return false;
  }
});

}
}
