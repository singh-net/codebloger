import { CookieService } from 'ngx-cookie-service';
import { scrollTop } from 'src/app/_services/helpers';
import { environment } from './../../../environments/environment';
import { Comment } from './../../_models/comment';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ControlValueAccessor,
} from '@angular/forms';
import { MsgResponse } from './../../_models/msgResponse';
import { Article } from './../../_models/article';
import { BlogService } from './../../_services/blog.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.css'],
  providers: [MessageService],
})
export class ArticlePageComponent implements OnInit {
  article: Article;
  username: string;
  slug: string;
  user: User;
  commentForm: FormGroup;
  comment: Comment;
  basePhotoUrl = environment.photoUrl;
  isScrollTop = true;
  cookieValue: any;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private accountService: AccountService,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private titleService: Title,
    private cookieService: CookieService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    this.activeRoute.params.subscribe((routeParams) => {
      this.titleService.setTitle('CodeBlogers: ' + routeParams.slug);
      this.getArticle(routeParams.slug);
      this.setVisitedPagesCookie(routeParams.slug);
    });
    this.initializeForm();
  }

  setVisitedPagesCookie(slug: string) {
    const cookieExists: boolean = this.cookieService.check('VisitedPages');
    if (!cookieExists) {
      this.cookieService.set('VisitedPages', JSON.stringify(slug), {
        expires: 30,
        sameSite: 'Lax',
        path: '/',
      });
      this.blogService.viewCountPlus(slug).subscribe(
        (response) => {},
        (error) => {
          console.log(error);
        }
      );
    }
    var cookie: string[] = JSON.parse(this.cookieService.get('VisitedPages'));
    var newCookie = cookie.concat(slug);
    if (!cookie.includes(slug)) {
      this.cookieService.set('VisitedPages', JSON.stringify(newCookie), {
        expires: 30,
        sameSite: 'Lax',
        path: '/',
      });
      this.blogService.viewCountPlus(slug).subscribe(
        (response) => {},
        (error) => {
          console.log(error);
        }
      );
    }
  }

  getArticle(slug: string) {
    this.blogService.getArticleBySlug(slug).subscribe(
      (response) => {
        this.article = response;
      },
      (error) => {
        if (error.status == 404) {
          this.router.navigateByUrl('not-found');
        }
      }
    );
    scrollTop();
  }

  getArticle2(slug: string) {
    this.blogService.getArticleBySlug(slug).subscribe((response) => {
      this.article = response;
    });
  }

  addLike(id: number) {
    if (this.user) {
      this.blogService.addArticleLike(id).subscribe(
        (response: MsgResponse) => {
          if (response.message == 'Liked') {
            this.messageService.add({
              severity: 'success',
              summary: 'Thank You.',
              detail: 'You liked this article',
            });
          }

          if (response.message == 'Disliked') {
            this.messageService.add({
              severity: 'success',
              summary: 'Hmmm...',
              detail: 'Article Disliked',
            });
          }

          this.activeRoute.params.subscribe((routeParams) => {
            this.getArticle(routeParams.slug);
          });
        },
        (error) => {
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
        summary: 'Error',
        detail: 'Please login/register to like articles',
      });
    }
  }

  initializeForm() {
    this.commentForm = this.fb.group({
      content: ['', Validators.required],
    });
  }

  insertComment() {
    this.comment = this.commentForm.value;
    this.comment.appUserId = this.user.id;
    this.comment.articleId = this.article.id;
    this.blogService.insertComment(this.comment).subscribe((response) => {
      this.activeRoute.params.subscribe((routeParams) => {
        this.getArticle2(routeParams.slug);
      });
    });
    this.commentForm.reset();
    this.isScrollTop = false;
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
}
