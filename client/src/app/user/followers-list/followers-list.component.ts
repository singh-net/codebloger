import { environment } from 'src/environments/environment';
import { MemberService } from './../../_services/member.service';
import { Member } from './../../_models/member';
import { Component, Input, OnInit } from '@angular/core';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-followers-list',
  templateUrl: './followers-list.component.html',
  styleUrls: ['./followers-list.component.css']
})
export class FollowersListComponent implements OnInit {
  //@Input() 
  followers: Member[];
  basePhotoUrl = environment.photoUrl;

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    this.getFollowers();
  }

  getFollowers() {
    this.memberService.getFollowers().subscribe((response: Member[]) => {
      this.followers = response;
      // console.log(response);
    })
  }


}
