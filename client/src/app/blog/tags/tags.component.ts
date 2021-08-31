import { Category } from './../../_models/category';
import { BlogService } from './../../_services/blog.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
})
export class TagsComponent implements OnInit {
  tags: Category[];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getCategories().subscribe((response: Category[]) => {
      this.tags = response;
      //console.log(this.tags);
    });
  }
}
