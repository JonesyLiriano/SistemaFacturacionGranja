import { Injectable } from '@angular/core';
import { Subject, Subscription, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private activeNav: Subject<boolean> = new Subject<boolean>();
  subscription: Subscription;
  activeNav$: Observable<boolean> = this.activeNav.asObservable();
  constructor() { }

  setActiveNav(response: boolean) {
    this.activeNav.next(response);
  }
}
