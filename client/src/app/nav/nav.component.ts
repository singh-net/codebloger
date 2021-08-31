import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { defaultIfEmpty, take } from 'rxjs/operators';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  user: User;
  isSideNavVisible: boolean = false;

  constructor(public accountService: AccountService, private router: Router) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit(): void {}

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  toggleSidebar() {
    this.isSideNavVisible = !this.isSideNavVisible;
    console.log(this.isSideNavVisible)
  }
}
