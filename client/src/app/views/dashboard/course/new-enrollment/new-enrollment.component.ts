import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { Constants } from 'src/app/providers/constant';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { ErrorStateMatcherService } from 'src/app/providers/error-matcher.service';

@Component({
  selector: 'app-new-enrollment',
  templateUrl: './new-enrollment.component.html',
  styleUrls: ['./new-enrollment.component.scss']
})


export class NewEnrollmentComponent implements OnInit {

  enrollForm: FormGroup;
  apiCallActive: boolean = false;
  courseId: any;
  constructor(public matDialog: MatDialogRef<NewEnrollmentComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: CommonAPIService, private errorHandlingService: ErrorHandlingService,
    public matcher: ErrorStateMatcherService, private fb: FormBuilder, private http: HttpClient,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute,) {
      console.log(data);
      
    this.courseId = data.courseId;
    this.enrollForm = this.fb.group({
      user: ['', Validators.required],
    });
    this.enrollForm.controls['user'].valueChanges.pipe(debounceTime(500)).subscribe({
      next: (value: any) => {
        this.getUsersToEnroll(value)
      }
    })
  }
  displayFn(user: any): string {
    return user ? user.email : '';
  }

  getUsersToEnroll(user: any) {
    // this.apiCallActive = true;
    let apiUrl = apiConstants.getUsersToEnroll.replace(':id', this.courseId)
    if (user) {
      apiUrl += "?search=" + user.toLowerCase()
    } else {
      this.filteredUsers = [];
      return
    }


    this.apiService.get(apiUrl).subscribe({
      next: (data) => {
        // this.apiCallActive = false;
        // if (data.statusCode === 200) {
        this.filteredUsers = data.users
        // this.dataSource = new MatTableDataSource<any>(data.enrollments || []);
        // } else {
        //   this.errorHandlingService.handle(data);
        // }
      },
      error: (e) => {
        this.apiCallActive = false;
        this.errorHandlingService.handle(e);
      },
    });
  }
  selectedOption: any;
  changed(option: any) {
    console.log(option);

    this.selectedOption = option.value
  }
  ngOnInit(): void {
  }
  filteredUsers: any = []
  enrollUser() {
    if (this.enrollForm.valid && this.selectedOption == this.enrollForm.value.user) {
      this.apiService.post(apiConstants.courseEnrollment.replace(":id", this.courseId),
        {
          user: this.enrollForm.value.user,
        }).subscribe({
          next: (data) => {
            // if (data.statusCode === 201 || data.statusCode === 200) {
            this.alertService.notify(data.message);
            this.matDialog.close(data);

            // } else {
            //   this.errorHandlingService.handle(data);
            // }
          },
          error: (e) => this.errorHandlingService.handle(e),
        });
    }
  }

}
