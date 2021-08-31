import { BlogService } from './../../_services/blog.service';
import { Article } from './../../_models/article';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-more-by-user',
  templateUrl: './more-by-user.component.html',
  styleUrls: ['./more-by-user.component.css'],
})
export class MoreByUserComponent implements OnInit {
  @Input() username = '';
  articles: Article[];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.getArticles();
  }

  getArticles() {
    this.blogService.getTop10ArticlesByUser(this.username).subscribe(
      (response: Article[]) => {
        this.articles = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
