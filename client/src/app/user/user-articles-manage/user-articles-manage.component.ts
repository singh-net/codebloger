import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';
import { AccountService } from './../../_services/account.service';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { Article } from './../../_models/article';
import { Pagination } from './../../_models/pagination';
import { UserParams } from './../../_models/userParams';
import { BlogService } from './../../_services/blog.service';
import { MemberService } from './../../_services/member.service';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

import { MenuModule } from 'primeng/menu';
import { scrollTop } from 'src/app/_services/helpers';

@Component({
  selector: 'app-user-articles-manage',
  templateUrl: './user-articles-manage.component.html',
  styleUrls: ['./user-articles-manage.component.css'],
  providers: [MessageService],
})
export class UserArticlesManageComponent implements OnInit {
  @Input() username = '';
  userParams: UserParams;
  pagination: Pagination;
  articles: Article[] = [];
  items: MenuItem[];
  user: User;
  //isPublished = true;

  constructor(
    private route: ActivatedRoute,
    private memberService: MemberService,
    private blogService: BlogService,
    private accountService: AccountService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.userParams = this.blogService.getUserParams();
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Options',
        items: [
          {
            label: 'Update',
            icon: 'pi pi-refresh',
          },
          {
            label: 'Delete',
            icon: 'pi pi-times',
          },
        ],
      },
    ];

    this.userParams.username = this.user.username;
    this.userParams.filter = 'self';
    this.getArticlesPaged();
  }

  getArticlesPaged(): void {
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
  paginate(event): void {
    this.userParams.pageNumber = event.page + 1;
    event.rows = this.userParams.pageSize;
    this.getArticlesPaged();
    scrollTop();
  }

  confirmDelete(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to remove?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.removeArticle(id);
      },
      reject: () => {},
    });
  }

  removeArticle(id: number) {
    this.blogService.removeArticle(id).subscribe((response) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Message',
        detail: 'Article Deleted',
      });
      this.getArticlesPaged();
    });
  }
}
