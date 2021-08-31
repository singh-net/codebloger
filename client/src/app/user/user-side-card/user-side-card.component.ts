import { MsgResponse } from './../../_models/msgResponse';
import { MemberService } from './../../_services/member.service';
import { Member } from './../../_models/member';
import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-side-card',
  templateUrl: './user-side-card.component.html',
  styleUrls: ['./user-side-card.component.css'],
  providers: [MessageService],
})
export class UserSideCardComponent implements OnInit {
  @Input() username = '';
  member: Member;
  user: User;
  isFollow = false;
  basePhotoUrl = environment.photoUrl;


  constructor(
    private memberService: MemberService,
    private messageService: MessageService,
    private accountService: AccountService,
    private router: Router
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit(): void {   
    this.isFollowing();
    this.getMember(this.username);
  }

  getMember(username: string) {
    this.memberService.getMember(username).subscribe((response: Member) => {
      this.member = response;
    });
  }

  addFollow(username: string) {
    if (this.user) {
      this.memberService.addFollow(username).subscribe(
        (response: MsgResponse) => {
          if (response.message == 'followed') {
            this.isFollow = true;
            this.messageService.add({
              severity: 'success',
              summary: 'Thank You.',
              detail: 'You followed ' + this.username,
            });
          }

          if (response.message == 'unfollowed') {
            this.isFollow = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Hmmm...',
              detail: 'You unfollowed ' + this.username,
            });
          }

          this.getMember(this.username);
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error,
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Please Login',
        detail: 'Please register/login to follow other users',
      });
    }

    this.getMember(this.username);
    //this.router.navigateByUrl('/' + this.username);
  }
  isFollowing() {
    if (this.user) {
      this.memberService.isFollowing(this.username).subscribe((res) => {
        if (res === true) {
          this.isFollow = true;
        } else {
          this.isFollow = false;
        }
      });
    }
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
