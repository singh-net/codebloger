import { scrollTop } from 'src/app/_services/helpers';
import { Router } from '@angular/router';
import { User } from 'src/app/_models/user';
import { Pagination } from './../_models/pagination';
import { UserParams } from './../_models/userParams';
import { Article } from './../_models/article';
import { MemberService } from './../_services/member.service';
import { BlogService } from './../_services/blog.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  articles: Article[] = [];
  pagination: Pagination;
  userParams: UserParams;
  totalPages: number;
  user: User;

  constructor(
    private blogService: BlogService,
    public accountService: AccountService,
    private titleService: Title  ) {
    this.userParams = this.blogService.getUserParams();
  
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (
      document.body.scrollTop > 80 ||
      document.documentElement.scrollTop > 80
    ) {
      document.getElementById('secondary-menu').classList.add('fixed');
    } else {
      document.getElementById('secondary-menu').classList.remove('fixed');
    }
  }

  ngOnInit(): void {
    this.userParams.username = '';
    this.userParams.filter = 'all';
    //this.redirectTo(this.router.url);
    this.getArticlesPaged();
    this.titleService.setTitle('Codeblogers')
  }



  // getArticlesPaged() {
  //   this.blogService.getPublishedArticlesPaged(this.userParams).subscribe(
  //     (response) => {
  //       this.articles = response.result;
  //       this.pagination = response.pagination;
  //       scrollTop();
  //     },
  //     (error) => {
  //       console.log(error.error);
  //     }
  //   );
  // }

  viewCount() {
    this.userParams.orderBy = 'viewCount';
    this.getArticlesPaged();
    scrollTop();
  }

  latest() {
    this.userParams.orderBy = 'dateCreated';
    this.getArticlesPaged();
    scrollTop();
  }

  mostLiked() {
    this.userParams.orderBy = 'likeCount';
    this.getArticlesPaged();
    scrollTop();
  }

  paginate(event) {
    this.userParams.pageNumber = event.page + 1;
    event.rows = this.userParams.pageSize;

    this.getArticlesPaged();
  }

  loadMore() {
    this.userParams.pageNumber++;
    this.blogService.getArticlesPaged(this.userParams).subscribe(
      (response) => {
        if (this.userParams.pageNumber == 1) {
          this.articles = response.result;
        } else {
          this.articles.push(...response.result);
        }
        this.pagination = response.pagination;
      },
      (error) => {
        console.log(error.error);
      }
    );
  }

  getArticlesPaged() {
    this.blogService.getArticlesPaged(this.userParams).subscribe(
      (response) => {
        if (this.userParams.pageNumber == 1) {
          this.articles = response.result;
        }
        this.pagination = response.pagination;
      },
      (error) => {
        console.log(error.error);
      }
    );
  }
}
