import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from 'src/app/_models/user';
import { take, delay } from 'rxjs/operators';
import { Pagination } from './../../_models/pagination';
import { UserParams } from './../../_models/userParams';
import { Article } from './../../_models/article';
import { AccountService } from 'src/app/_services/account.service';
import { BlogService } from './../../_services/blog.service';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage-articles',
  templateUrl: './manage-articles.component.html',
  styleUrls: ['./manage-articles.component.css'],
  providers: [MessageService],
})
export class ManageArticlesComponent implements OnInit {
  articles: Article[];
  userParams: UserParams;
  pagination: Pagination;
  user: User;
  displayContent: boolean = false;
  content: string;

  constructor(
    private blogService: BlogService,
    private accountService: AccountService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.user = user));
    
    
    this.userParams = this.blogService.getUserParams();
  }

  ngOnInit(): void {
    this.userParams.filter = 'admin-manage';
    this.getArticlesPaged();
  }

  getArticlesPaged() {
    this.userParams.username = this.user.username;
    this.userParams.filter = 'admin-manage';
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

  paginate(event) {
    this.userParams.pageNumber = event.page + 1;
    event.rows = this.userParams.pageSize;
    this.getArticlesPaged();
  }

  showDialog(content: string) {
    this.displayContent = true;
    this.content = content;
  }

  confirmRemove(event: Event, id: number) {
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

  confirmApprove(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to approve?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.approveArticle(id);
      },
      reject: () => {},
    });
  }

  confirmNotApprove(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Are you sure that you want to unpublish?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.noApproveArticle(id);
      },
      reject: () => {},
    });
  }
  approveArticle(id: number) {
    this.blogService
      .approveArticle(id)
      //.pipe()
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Approved',
            detail: 'Article with id: ' + id + ' has been approved',
          });
          this.getArticlesPaged();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error,
          });
        }
      );
  }

  noApproveArticle(id: number) {
    this.blogService
      .notApproveArticle(id)
      //.pipe()
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Unpublish',
            detail: 'Article with id: ' + id + ' has been unpublished',
          });
          this.getArticlesPaged();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error,
          });
        }
      );
  }

  removeArticle(id: number) {
    this.blogService
      .removeArticle(id)
      //.pipe()
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Removed',
            detail: 'Article with id: ' + id + ' has been removed',
          });
          this.getArticlesPaged();
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error,
          });
        }
      );
  }
}
