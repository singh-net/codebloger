import { ActivatedRoute } from '@angular/router';
import { MemberService } from './../../_services/member.service';
import { BlogService } from './../../_services/blog.service';
import { UserParams } from './../../_models/userParams';
import { Pagination } from './../../_models/pagination';
import { Article } from './../../_models/article';
import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/_services/account.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-articles-by-category-list',
  templateUrl: './articles-by-category-list.component.html',
  styleUrls: ['./articles-by-category-list.component.css'],
})
export class ArticlesByCategoryListComponent implements OnInit {
  articles: Article[];
  pagination: Pagination;
  userParams: UserParams;
  totalPages: number;

  constructor(
    private blogService: BlogService,
    private memberService: MemberService,
    public accountService: AccountService,
    private route: ActivatedRoute,
    private titleService: Title
  ) {
    this.userParams = this.blogService.getUserParams();
  }

  ngOnInit(): void {
   
    this.userParams.filter = 'tag';   
    this.route.paramMap.subscribe((params) => {
      this.userParams.tag = params.get('name');
    });

    

    this.titleService.setTitle('Codeblogers: ' + this.userParams.tag)
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

  paginate(event) {
    this.userParams.pageNumber = event.page + 1;
    event.rows = this.userParams.pageSize;
    this.getArticlesPaged();
  }
}
