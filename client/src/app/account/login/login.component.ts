import { NavComponent } from './../../nav/nav.component';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @Output() userLoginEvent = new EventEmitter();

  loginForm: FormGroup;
  isUserInValid = false;
  errorMessage: string;

  constructor(
    private fb: FormBuilder,
    public accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.accountService.login(this.loginForm.value).subscribe(
      (response) => {
       // let navComponent = new NavComponent(this.accountService, this.router);
        //navComponent.ngOnInit();
        
        this.router.navigateByUrl('/');
       // window.location.reload();




      },
      (error) => {
        this.errorMessage = error.error;
        this.isUserInValid = true;
        //console.log(this.errorMessage);
      }
    );
  }
}
