import { User } from 'src/app/_models/user';

import { map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../_services/account.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  user: User;
  constructor(private accountService: AccountService, private router: Router) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user = user;
    });
  }

  canActivate(): Observable<boolean> | boolean {
    if (!this.user) {
      this.router.navigate(['account/login']);
      return false;
    }
    return true;
  }
}
