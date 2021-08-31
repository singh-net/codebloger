import { environment } from 'src/environments/environment';
import { Member } from './../../_models/member';
import { MemberService } from './../../_services/member.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-following-list',
  templateUrl: './following-list.component.html',
  styleUrls: ['./following-list.component.css'],
})
export class FollowingListComponent implements OnInit {
  followings: Member[];
  basePhotoUrl = environment.photoUrl;


  constructor(private memberService: MemberService) {}

  ngOnInit(): void {
    this.getFollowings();
  }

  getFollowings() {
    this.memberService.getFollowings().subscribe((response: Member[]) => {
      this.followings = response;
    });
  }
}
