import { PaginatedResult } from './../_models/pagination';
import { Comment } from './../_models/comment';
import { Category } from './../_models/category';
import { UserParams } from './../_models/userParams';
import { Article } from './../_models/article';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take, map } from 'rxjs/operators';
import { AccountService } from './account.service';
import { User } from '../_models/user';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  baseUrl = environment.apiUrl;
  posts: Article[] = [];
  articleCache = new Map();
  userParams: UserParams;
  user: User;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.userParams = new UserParams();
      //console.log(user);
    });

    this.userParams = new UserParams();
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  // resetUserParams() {
  //   this.userParams = new UserParams(this.user);
  //   return this.userParams;
  // }

  getArticlesPaged(userParams: UserParams) {
    var response = this.articleCache.get(Object.values(userParams).join('-'));
    // if (response) {
    //   return of(response);
    // }

    let params = getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('orderBy', userParams.orderBy);
    params = params.append('username', userParams.username);
    params = params.append('filter', userParams.filter);
    params = params.append('tag', userParams.tag);

    return getPaginatedResult<Article[]>(
      this.baseUrl + 'blog/paged',
      params,
      this.http
    ).pipe(
      map((response) => {
        this.articleCache.set(Object.values(userParams).join('-'), response);

        return response;
      })
    );
  }

  getPublishedArticlesPaged(userParams: UserParams) {
    var response = this.articleCache.get(Object.values(userParams).join('-'));
    if (response) {
      return of(response);
    }
    let params = getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('orderBy', userParams.orderBy);
    params = params.append('username', userParams.username);
    params = params.append('filter', userParams.filter);
    params = params.append('tag', userParams.tag);

    return getPaginatedResult<Article[]>(
      this.baseUrl + 'blog/published',
      params,
      this.http
    ).pipe(
      map((response) => {
        this.articleCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );
  }

  getArticleBySlug(slug: string) {
    return this.http.get<Article>(this.baseUrl + 'blog/a/' + slug);
  }

  getTop10ArticlesByUser(username: string) {
    return this.http.get<Article[]>(
      this.baseUrl + 'blog/more-by-user/' + username
    );
  }

  addArticleLike(articleId: number) {
    return this.http.post(this.baseUrl + 'articlelike/' + articleId, {});
  }

  removeArticle(id: number) {
    return this.http.delete(this.baseUrl + 'blog/delete/' + id, {});
  }

  approveArticle(id: number) {
    return this.http.put(this.baseUrl + 'blog/approve/' + id, {});
  }

  notApproveArticle(id: number) {
    return this.http.put(this.baseUrl + 'blog/not-approve/' + id, {});
  }

  getTopCategories() {
    return this.http.get(this.baseUrl + 'blog/top-categories');
  }

  getCategories() {
    return this.http.get<Category[]>(this.baseUrl + 'blog/categories');
  }

  submitArticle(model: Article) {
    return this.http.post(this.baseUrl + 'blog', model);
  }

  insertComment(model: Comment) {
    return this.http.post(this.baseUrl + 'comment/insert', model);
  }
  viewCountPlus(slug: string) {
    return this.http.get(this.baseUrl + 'blog/viewCountPlus/' + slug);
  }

  addCategory(model: Category) {
    return this.http.post(this.baseUrl + 'blog/add-category', model);
  }
}
