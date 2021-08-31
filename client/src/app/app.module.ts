import { HasRoleDirective } from './_directives/has-role.directive';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardModule } from 'primeng/card';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { PasswordModule } from 'primeng/password';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from './_forms/text-input/text-input.component';
import { ArticleCardComponent } from './blog/article-card/article-card.component';
import { ArticlePageComponent } from './blog/article-page/article-page.component';
import { DateAgoPipe } from './_pipes/date-ago.pipe';
import { PaginatorModule } from 'primeng/paginator';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { UserSideCardComponent } from './user/user-side-card/user-side-card.component';
import { ToastModule } from 'primeng/toast';
import { TopBloggersComponent } from './user/top-bloggers/top-bloggers.component';
import { TopTagsComponent } from './blog/top-tags/top-tags.component';
import { TagsComponent } from './blog/tags/tags.component';
import { UserProfilePageComponent } from './user/user-profile-page/user-profile-page.component';
import { TabViewModule } from 'primeng/tabview';
import { FollowersListComponent } from './user/followers-list/followers-list.component';
import { FollowingListComponent } from './user/following-list/following-list.component';
import { PhotoEditorComponent } from './user/photo-editor/photo-editor.component';
import { FileUploadModule } from 'primeng/fileupload';
import { UnauthComponent } from './pages/unauth/unauth.component';
import { NewArticleComponent } from './blog/new-article/new-article.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { EditorModule } from 'primeng/editor';
import { AddPhotoComponent } from './blog/add-photo/add-photo.component';
import { ArticlesByCategoryListComponent } from './blog/articles-by-category-list/articles-by-category-list.component';
import { SidebarModule } from 'primeng/sidebar';
import { MemberProfilePageComponent } from './user/member-profile-page/member-profile-page.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserArticlesManageComponent } from './user/user-articles-manage/user-articles-manage.component';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PanelModule } from 'primeng/panel';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { ScrollTopModule } from 'primeng/scrolltop';
import { FooterComponent } from './footer/footer.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ManageArticlesComponent } from './admin/manage-articles/manage-articles.component';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { MembersPageComponent } from './user/members-page/members-page.component';
import { MoreByUserComponent } from './blog/more-by-user/more-by-user.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ArticlePlaceholderComponent } from './placeholders/article-placeholder/article-placeholder.component';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { CookieService } from 'ngx-cookie-service';
import { FollowButtonComponent } from './user/follow-button/follow-button.component';
import { Chips, ChipsModule } from 'primeng/chips';
import { KeyFilterModule } from 'primeng/keyfilter';
import { UserManagerComponent } from './admin/user-manager/user-manager.component';

import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    TextInputComponent,
    ArticleCardComponent,
    ArticlePageComponent,
    DateAgoPipe,
    UserSideCardComponent,
    TopBloggersComponent,
    TopTagsComponent,
    TagsComponent,
    UserProfilePageComponent,
    FollowersListComponent,
    FollowingListComponent,
    PhotoEditorComponent,
    UnauthComponent,
    NewArticleComponent,
    AddPhotoComponent,
    ArticlesByCategoryListComponent,
    MemberProfilePageComponent,
    UserArticlesManageComponent,
    FooterComponent,
    NotFoundComponent,
    HasRoleDirective,
    ManageArticlesComponent,
    MembersPageComponent,
    MoreByUserComponent,
    ArticlePlaceholderComponent,
    FollowButtonComponent,
    UserManagerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CardModule,
    MenubarModule,
    ButtonModule,
    BrowserAnimationsModule,
    PasswordModule,
    HttpClientModule,
    FormsModule,
    PaginatorModule,
    ReactiveFormsModule,
    VirtualScrollerModule,
    ToastModule,
    TabViewModule,
    FileUploadModule,
    MultiSelectModule,
    EditorModule,
    SidebarModule,
    ProgressSpinnerModule,
    TableModule,
    InputSwitchModule,
    PanelModule,
    MenuModule,
    TooltipModule,
    ScrollTopModule,
    DialogModule,
    ConfirmPopupModule,
    ImageCropperModule,
    LoadingBarModule,
    LoadingBarRouterModule,
    ChipsModule,
    KeyFilterModule,
    PasswordStrengthMeterModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    ConfirmationService,
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
