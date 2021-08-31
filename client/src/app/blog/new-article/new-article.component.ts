import { MessageService } from 'primeng/api';
import { ArticleCategories } from './../../_models/articleCategories';
import { Article } from './../../_models/article';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BlogService } from './../../_services/blog.service';
import { Category } from './../../_models/category';
import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';
import { take } from 'rxjs/operators';
import { AddPhotoComponent } from '../add-photo/add-photo.component';

@Component({
  selector: 'app-new-article',
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.css'],
  providers: [MessageService],
})
export class NewArticleComponent implements OnInit {
  @ViewChild(AddPhotoComponent) private photoComponent: AddPhotoComponent;

  articleForm: FormGroup;
  user: User;
  article: Article;
  tags: Category[];
  selectedTags: any[];
  toggleNewTagModal: boolean;
  newTag: string;
  isNtError: boolean;
  ntError: string;
  blockSpace: RegExp = /[^\s]/;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private blogService: BlogService,
    private accountService: AccountService,
    private messageService: MessageService
  ) {
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getCategories();
    this.selectedTags = [];

    const toolbarOptions = {
      container: [['bold', 'italic', 'underline', 'strike'], ['emoji']],
      handlers: { emoji: function () {} },
    };
  }

  initializeForm() {
    this.articleForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(200),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(500),
        ],
      ],
      content: ['', [Validators.required, Validators.minLength(50)]],
      tags: [''],
      newTag: [''],
    });
  }

  getCategories() {
    this.blogService.getCategories().subscribe((response: Category[]) => {
      this.tags = response;
    });
  }

  submitArticle() {
    this.article = this.articleForm.value;
    this.article.appUserId = this.user.id;
    this.article.articleCategories = [];
    this.selectedTags.forEach((item) => {
      this.article.articleCategories.push({ categoryId: item });
    });

    if (this.photoComponent.uploadedPhoto != null) {
      this.article.photoUrl = this.photoComponent.uploadedPhoto.url;
    }
    this.blogService.submitArticle(this.article).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Service Message',
          detail:
            'Thank you! Your article has been submitted successfully. Admin will review and then publish it.',
        });
        this.initializeForm();
        this.selectedTags = [];
        this.photoComponent.uploadedPhoto = null;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Service Message',
          detail: 'Error while submitting article. Please try again later.',
        });
      }
    );
  }
  addNewTag(event: any) {
    if (event.target.newTag.value !== '') {
      var category: Category = {
        name: event.target.newTag.value,
        description: '',
        id: 0,
        postCount: 0,
      };

      this.blogService.addCategory(category).subscribe(
        (response) => {
          this.getCategories();
          event.target.newTag.value = '';
          this.toggleNewTagModal = false;
          this.isNtError = false;
          this.messageService.add({
            severity: 'info',
            summary: 'Information',
            detail: 'New tag saved in system, you can now use it.',
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error,
          });
          this.isNtError = true;
          this.ntError = error.error;
        }
      );
    } else if (event.target.newTag.value === '') {
      this.isNtError = true;
      this.ntError = 'Please Enter a value';
    }
  }

  showModalDialog() {
    this.toggleNewTagModal = true;
  }
  get articleFormControl() {
    return this.articleForm.controls;
  }
}
