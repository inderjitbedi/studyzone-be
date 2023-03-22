import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { AuthGuard } from 'src/app/providers/auth.guard';
import { Constants } from 'src/app/providers/constant';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { ErrorStateMatcherService } from 'src/app/providers/error-matcher.service';
import { GetSetService } from 'src/app/providers/getSet.provider';
import { Validator } from 'src/app/providers/Validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private errorHandlingService: ErrorHandlingService,
    private formBuilder: FormBuilder,
    private apiService: CommonAPIService,
    private router: Router,
    public authGuard: AuthGuard,
    public matcher: ErrorStateMatcherService,
    public getSetService: GetSetService
  ) {
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(Validator.emailValidator.pattern),
        ],
      ],
      password: ['', Validators.required],
    });
  }
  login(): void {
    if (this.loginForm.valid) {
      this.apiService
        .post(apiConstants.signin, this.loginForm.value)
        .subscribe({
          next: (data) => {
            console.log(data);

            // if (data.statusCode === 201 || data.statusCode === 200) {
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem(
              'user',
              JSON.stringify(data.user)
            );
            this.router.navigate([Constants.Pages.USER_LIST]);
            // } else {
            //   this.errorHandlingService.handle(data);
            // }
          },
          error: (e) => {
            this.errorHandlingService.handle(e)
          },
        });
    }
  }

  ngOnInit(): void { }
}
