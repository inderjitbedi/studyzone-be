import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/providers/alert.service';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { ErrorStateMatcherService } from 'src/app/providers/error-matcher.service';
import { debounceTime } from "rxjs/operators";
import { apiConstants } from 'src/app/providers/api.constants';
import { Validator } from 'src/app/providers/Validator';
@Component({
  selector: 'app-invite-user-form',
  templateUrl: './invite-user-form.component.html',
  styleUrls: ['./invite-user-form.component.scss']
})
export class InviteUserFormComponent implements OnInit {
  inviteUserForm: FormGroup;
  userDetails: any = {}
  constructor(
    public matDialog: MatDialogRef<InviteUserFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: CommonAPIService, private errorHandlingService: ErrorHandlingService,
    public matcher: ErrorStateMatcherService, private fb: FormBuilder,
    private alertService: AlertService,) {
    this.userDetails = data.user;
    this.inviteUserForm = this.fb.group({
      email: [data?.user?.email || '', [Validators.required,
      Validators.pattern(Validator.emailValidator.pattern),]],
    });

    this.inviteUserForm['controls']['email'].valueChanges.pipe(debounceTime(500)).subscribe({
      next: (data) => {
        this.checkEmailUniqueness()
      }
    })
  }

  ngOnInit(): void {
  }

  inviteUser() {
    if (this.inviteUserForm.valid) {
      this.apiCallActive = true;
      let payload: any = {
        email: this.inviteUserForm.value.email
      }
      let apiUrl = apiConstants.inviteUser
      if (!this.userDetails?.isSignedUp && this.userDetails?._id) {
        apiUrl = apiConstants.reinviteUser
        payload._id = this.userDetails?._id
      }
      this.apiService.post(apiUrl, payload).subscribe({
        next: (data: any) => {
          // if (data && (data.statusCode === 200 || data.statusCode === 201)) {
          this.alertService.notify(data.message);
          this.matDialog.close(data);
          // } else {
          //   this.errorHandlingService.handle(data);
          // }
        },
        error: (error) => {
          this.errorHandlingService.handle(error);
        },
        complete: () => {
          this.apiCallActive = false;
        }

      });
    }
  }
  apiCallActive: boolean = false
  isViewOnly: boolean = false
  checkEmailUniqueness() {
    let formControl = this.inviteUserForm['controls']['email'];
    if (formControl.valid && formControl.value.trim() && formControl.value.trim() != this.userDetails?.email) {
      this.apiCallActive = true;
      this.apiService.get(apiConstants.checkEmailUniqueness + formControl.value.trim().toLowerCase()).subscribe({
        next: (data) => {
          this.apiCallActive = false;
          if (data.isUnique === false) {
            formControl.setErrors({ 'not_unique': true });
          } else {
            if (this.inviteUserForm['controls']['email'].errors) {
              delete this.inviteUserForm['controls']['email'].errors['not_unique'];
            }
          }
        },
        error: (e) => {
          this.apiCallActive = false;
          this.errorHandlingService.handle(e);
        },
      });
    }
  }

}
