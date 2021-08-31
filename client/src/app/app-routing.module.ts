import { UserManagerComponent } from './admin/user-manager/user-manager.component';
import { AdminGuard } from './_guards/admin.guard';
import { MembersPageComponent } from './user/members-page/members-page.component';
import { ManageArticlesComponent } from './admin/manage-articles/manage-articles.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { MemberProfilePageComponent } from './user/member-profile-page/member-profile-page.component';
import { ArticlesByCategoryListComponent } from './blog/articles-by-category-list/articles-by-category-list.component';
import { NewArticleComponent } from './blog/new-article/new-article.component';
import { UnauthComponent } from './pages/unauth/unauth.component';
import { AuthGuard } from './_guards/auth.guard';
import { UserProfilePageComponent } from './user/user-profile-page/user-profile-page.component';
import { TagsComponent } from './blog/tags/tags.component';
import { ArticlePageComponent } from './blog/article-page/article-page.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// const routess: Routes = [
//   {
//     path: '',
//     loadChildren: () => import('./home/home.component').then(m => m.HomeComponent),
//     pathMatch: 'full'
//   }
// ];

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'unauthorized', component: UnauthComponent },
  { path: 'not-found', component: NotFoundComponent },

  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'profile', component: UserProfilePageComponent },
      { path: 'new', component: NewArticleComponent },
      { path: 'dashboard', component: AdminDashboardComponent },
      {
        path: 'admin/manage-articles',
        component: ManageArticlesComponent,
        canActivate: [AdminGuard],
      },

      {
        path: 'admin/manage-users',
        component: UserManagerComponent,
        canActivate: [AdminGuard],
      },
    ],
  },

  { path: 'account/login', component: LoginComponent },
  { path: 'account/register', component: RegisterComponent },

  { path: 'tags/:name', component: ArticlesByCategoryListComponent },
  { path: 'tags', component: TagsComponent },

  { path: 'users', component: MembersPageComponent },
  { path: ':username', component: MemberProfilePageComponent },
  { path: ':username/:slug', component: ArticlePageComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
