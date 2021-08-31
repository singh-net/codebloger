import { environment } from './../../../environments/environment';
import { Pagination } from './../../_models/pagination';
import { UserParams } from './../../_models/userParams';
import { BlogService } from './../../_services/blog.service';
import { Article } from './../../_models/article';
import { MemberService } from './../../_services/member.service';
import { Member } from './../../_models/member';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-profile-page',
  templateUrl: './member-profile-page.component.html',
  styleUrls: ['./member-profile-page.component.css'],
})
export class MemberProfilePageComponent implements OnInit {
  username = '';
  member: Member;
  userParams: UserParams;
  pagination: Pagination;
  articles: Article[] = [];
  basePhotoUrl = environment.photoUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private memberService: MemberService,
    private blogService: BlogService
  ) {
    this.username = route.snapshot.paramMap.get('username');
    this.userParams = this.blogService.getUserParams();
    this.userParams.username = this.username;
  }

  ngOnInit(): void {
    this.getMember();
    this.userParams.filter = 'profile';
    this.getArticlesPaged();
    //console.log(this.userParams);
  }

  getArticlesPaged() {
    this.blogService.getArticlesPaged(this.userParams).subscribe(
      (response) => {
        this.articles = response.result;
        this.pagination = response.pagination;
      },
      (error) => {
        console.log(error.error);
      }
    );
  }

  getMember() {
    this.memberService.getMember(this.username).subscribe(
      (response) => {
        this.member = response;
      },
      (error) => {
        if (error.status === 404) {
          this.router.navigateByUrl('not-found')
        } else {
          console.log(error.error);
        }
      }
    );
  }
  paginate(event) {
    this.userParams.pageNumber = event.page + 1;
    event.rows = this.userParams.pageSize;
    this.getArticlesPaged();
  }
}
