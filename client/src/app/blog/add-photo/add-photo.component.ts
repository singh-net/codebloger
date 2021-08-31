import { environment } from './../../../environments/environment';
import { Member } from './../../_models/member';
import { MessageService } from 'primeng/api';
import { MemberService } from './../../_services/member.service';
import { Photo } from './../../_models/photo';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AccountService } from 'src/app/_services/account.service';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';
import {
  base64ToFile,
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';

@Component({
  selector: 'app-add-photo',
  templateUrl: './add-photo.component.html',
  styleUrls: ['./add-photo.component.css'],
  providers: [MessageService],
})
export class AddPhotoComponent implements OnInit {
  @Input() member: Member;
  @Input() doReload = false;

  user: User;
  baseUrl = environment.apiUrl;
  url: string = '';
  headers = [];
  uploadedPhoto: Photo;
  photoBaseUrl = environment.photoUrl;

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
  }

  ngOnInit(): void {}

  onSelect(event) {
    //console.log('My File upload', event);
    if (event.files.length == 0) {
      console.log('No file selected.');
      return;
    }

    var fileToUpload = event.files[0];
    let input = new FormData();
    input.append('file', fileToUpload);

    console.log(fileToUpload);

    this.http.post(this.baseUrl + 'blog/add-photo', input).subscribe(
      (response: Photo) => {
        if (response) {
          const photo: Photo = response;
          this.uploadedPhoto = photo;
          this.messageService.add({
            severity: 'success',
            summary: 'Service Message',
            detail: 'Photo uploaded successfully',
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onUpload(event): void {
    console.log('uploaded');
  }

  onBeforeSend(event): void {
    event.xhr.setRequestHeader('Authorization', 'Bearer ' + this.user.token);
    console.log(event);
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
      .post(this.baseUrl + 'blog/add-photo', input)
      .subscribe((response: Photo) => {
        if (response) {
          const photo: Photo = response;
          this.uploadedPhoto = photo;
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
