import { Pagination } from './../../_models/pagination';
import { UserParams } from './../../_models/userParams';
import { MemberService } from './../../_services/member.service';
import { Member } from './../../_models/member';
import { MessageService } from 'primeng/api';
import { Component, OnInit, resolveForwardRef } from '@angular/core';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css'],
  providers: [MessageService],
})
export class UserManagerComponent implements OnInit {
  users: Member[];
  userParams: UserParams;
  pagination: Pagination;

  constructor(private memberService: MemberService) {}

  ngOnInit(): void {
    this.getUsers();

    this.userParams = this.memberService.getUserParams();
  }

  getUsers() {
    this.memberService.getMembers().subscribe((response) => {
      this.users = response;
      // console.log(response);
    });
  }

  paginate(event) {
    this.userParams.pageNumber = event.page + 1;
    event.rows = this.userParams.pageSize;
    this.getUsers();
  }
}
