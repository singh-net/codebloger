import { Category } from './category';
import { ArticleCategories } from './articleCategories';
import { Photo } from './photo';
export interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  slug: string;
  dateCreated: string;
  appUserId: number;
  appUserFullName: string;
  isFeatured: boolean;
  isPublished: boolean;
  username: string;
  viewCount: number;
  heartCount: number;
  saveCount: number;
  likeCount: number;
  commentCount: number;
  readTime: number;
  photoUrl: string;
  appUserPhotoUrl: string;
  photos: Photo;
  articleCategories: ArticleCategories[];
  categories: Category[];
  comment: Comment[];
}
