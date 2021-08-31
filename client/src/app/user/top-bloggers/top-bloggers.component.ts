import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { Member } from './../../_models/member';
import { MemberService } from './../../_services/member.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-bloggers',
  templateUrl: './top-bloggers.component.html',
  styleUrls: ['./top-bloggers.component.css'],
  providers: [MessageService],
})
export class TopBloggersComponent implements OnInit {
  members: Member[] = [];
  basePhotoUrl = environment.photoUrl;

  constructor(
    private memberService: MemberService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getTopBloggers();
  }

  getTopBloggers() {
    this.memberService.getTopBloggers().subscribe((response: Member[]) => {
      this.members = response;
    });
  }
}
