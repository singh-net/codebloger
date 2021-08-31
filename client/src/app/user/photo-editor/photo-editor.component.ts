import { MessageService, MenuItem } from 'primeng/api';
import { environment } from './../../../environments/environment';
import { Photo } from './../../_models/photo';
import { MemberService } from './../../_services/member.service';
import { Member } from './../../_models/member';
import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {
  base64ToFile,
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css'],
  providers: [MessageService],
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member;
  user: User;
  baseUrl = environment.apiUrl;
  url: string = '';
  headers = [];
  basePhotoUrl = environment.photoUrl;
  // uploadedFiles: any[] = [];
  togglePhotoDialog: boolean = false;
  imageSelected = false;

  //image cropper
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  //image cropper

  constructor(
    private accountService: AccountService,
    private memberService: MemberService,
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.accountService.currentUser$
      .pipe(take(1))
      .subscribe((user) => (this.user = user));

    this.url = this.baseUrl + 'users/add-photo';
    this.headers = [{ name: 'Accept', value: 'application/json' }];
  }

  ngOnInit(): void {

  }

  onSelect(event) {
    //console.log('My File upload', event);
    if (event.files.length == 0) {
      console.log('No file selected.');
      return;
    }
    var fileToUpload = event.files[0];
    let input = new FormData();
    input.append('file', fileToUpload);

    this.http
      .post(this.baseUrl + 'users/add-photo', input)
      .subscribe((response: Photo) => {
        if (response) {
          const photo: Photo = response;
          this.member.userPhotos.push(photo);
          if (photo.isMain) {
            this.user.photoUrl = photo.url;
            this.member.photoUrl = photo.url;
            this.accountService.setCurrentUser(this.user);
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Service Message',
            detail: 'Photo uploaded successfully',
          });
        }
      });
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe(() => {
      this.user.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.userPhotos.forEach((p) => {
        if (p.isMain) p.isMain = false;
        if (p.id === photo.id) p.isMain = true;
      });
    });
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe(() => {
      this.member.userPhotos = this.member.userPhotos.filter(
        (x) => x.id !== photoId
      );
    });
  }

  onUpload(event): void {
    console.log('uploaded');
  }

  onBeforeSend(event): void {
    event.xhr.setRequestHeader('Authorization', 'Bearer ' + this.user.token);
  }

  showDialog() {
    this.togglePhotoDialog = true;
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    //console.log(event, base64ToFile(event.base64));
  }

  imageLoaded() {
    this.showCropper = true;
    //console.log('Image loaded');
    this.imageSelected = true;
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    //console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    //console.log('Load failed');
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  uploadPhoto() {
    var blobFile = base64ToFile(this.croppedImage);
    //console.log(fileToUpload);
    const file = new File([blobFile], 'uploadedImage.jpeg');
    let input = new FormData();
    input.append('file', file);
    this.http
      .post(this.baseUrl + 'users/add-photo', input)
      .subscribe((response: Photo) => {
        if (response) {
          const photo: Photo = response;
          this.member.userPhotos.push(photo);
          if (photo.isMain) {
            this.user.photoUrl = photo.url;
            this.member.photoUrl = photo.url;
            this.accountService.setCurrentUser(this.user);
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Service Message',
            detail: 'Photo uploaded successfully',
          });

          this.togglePhotoDialog = false;
        }
      });
  }
}
