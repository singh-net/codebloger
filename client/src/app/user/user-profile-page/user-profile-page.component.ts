import { MessageService } from 'primeng/api';
import { environment } from './../../../environments/environment';
import { UserParams } from './../../_models/userParams';
import { Article } from './../../_models/article';
import { Pagination } from './../../_models/pagination';
import { BlogService } from './../../_services/blog.service';
import { Member } from './../../_models/member';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.css'],
  providers: [MessageService],
})
export class UserProfilePageComponent implements OnInit {
  user: User;
  member: Member;
  basePhotoUrl = environment.photoUrl;
  constructor(
    private accountService: AccountService,
    private blogService: BlogService,
    private messgaeService: MessageService
  ) {
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {
    //if (this.user == null) console.log('not authorized');
    this.loadMember();
  }

  loadMember() {
    this.accountService
      .getUserByUsername(this.user.username)
      .subscribe((data) => {
        this.member = data;
      });
  }

  updateMember(member: Member) {
    this.accountService.updateMember(this.member).subscribe(() => {
      console.log('updated');
      this.messgaeService.add({
        severity: 'success',
        summary: 'Message',
        detail: 'Your profile updated',
      });
    });
  }
}
