import { BlogService } from './../../_services/blog.service';
import { Category } from './../../_models/category';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-tags',
  templateUrl: './top-tags.component.html',
  styleUrls: ['./top-tags.component.css'],
})
export class TopTagsComponent implements OnInit {
  tags: Category[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {

    this.blogService.getTopCategories().subscribe((response: Category[]) => {
      this.tags = response
    })
  }
}
