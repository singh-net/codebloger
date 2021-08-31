import { User } from 'src/app/_models/user';
import { map, take } from 'rxjs/operators';
import { AccountService } from 'src/app/_services/account.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  user: User;
  constructor(private accountService: AccountService, private router: Router) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user = user;
    });
  }

  canActivate(): Observable<boolean> | boolean {
    if (
      this.user.roles.includes('Admin') ||
      this.user.roles.includes('Moderator')
    ) {
      return true;
    }
    this.router.navigate(['unauthorized']);
    return false;
  }
}
