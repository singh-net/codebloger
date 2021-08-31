import { AccountService } from './../../_services/account.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isUserInValid = false;
  errorMessage: string;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.registerForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
        
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
    });

    // this.registerForm.controls.password.valueChanges.subscribe(() => {
    //   this.registerForm.controls.confirmPassword.updateValueAndValidity();
    // });
  }

  // checkUsername() {
  //   console.log('checked');
  // }

  register() {
    this.accountService.register(this.registerForm.value).subscribe(
      (response) => {
        this.router.navigateByUrl('/');
      },
      (error) => {
        if (Array.isArray(error.error)) {
          var result = '';
          error.error.forEach((desc) => {
            result = result + desc.description + ' ';
          });

          this.errorMessage = result;
        } else {
          this.errorMessage = error.error;
        }
        console.log(error);
        this.isUserInValid = true;
      }
    );
  }

  matchValues(matchTO: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTO].value
        ? null
        : { isMatching: true };
    };
  }
  // checkPass(event: any) {
  //   console.log(event);
  // }

}
