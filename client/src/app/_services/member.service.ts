import { UserParams } from './../_models/userParams';
import { environment } from './../../environments/environment';
import { Member } from './../_models/member';
import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';
import { AccountService } from './account.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  user: User;
  userParams: UserParams;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.userParams = new UserParams();
    });
  }
  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    this.userParams = new UserParams();
    return this.userParams;
  }
  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }

  getMember(username: string) {
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + 'users/users');
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member);
  }

  addFollow(username: string) {
    return this.http.post(this.baseUrl + 'follow/' + username, {});
  }

  getTopBloggers() {
    return this.http.get(this.baseUrl + 'users/top-bloggers');
  }

  getFollowers() {
    return this.http.get(this.baseUrl + 'follow/followers' );
  }

  getFollowings() {
    return this.http.get(this.baseUrl + 'follow/followings' );
  }
  isFollowing(username: string) {
    return this.http.get(this.baseUrl + 'follow/is-following/' + username );
  }
}
