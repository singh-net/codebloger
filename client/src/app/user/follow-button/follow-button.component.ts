import { take } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { Member } from './../../_models/member';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';
import { MessageService } from 'primeng/api';
import { MsgResponse } from './../../_models/msgResponse';
import { MemberService } from './../../_services/member.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-follow-button',
  templateUrl: './follow-button.component.html',
  styleUrls: ['./follow-button.component.css'],
  providers: [MessageService],
})
export class FollowButtonComponent implements OnInit {
  @Input() username = '';
  @Input() styleClasses = '';

  member: Member;
  user: User;
  isFollow = false;


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
    this.getMember(this.username);
    this.isFollowing();
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
}
