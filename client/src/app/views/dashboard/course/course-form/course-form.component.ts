import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { ErrorStateMatcherService } from 'src/app/providers/error-matcher.service';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {
  toggle: boolean = false
  isViewOnly: any;
  courseId: any;
  categoryName: any;
  courseForm: FormGroup;
  apiCallActive: boolean = false;
  nameMaxLength: number = 50;
  courseList: any = [];
  color: any = '#039ee3';
  isUnique: boolean = true;
  fileObject: any = {};
  uploadingInProgess: boolean = false;
  uploadingProgress: any;
  attachment: any = null;
  types: any[] = [
    { value: 'public', name: 'Public' },
    { value: 'private', name: 'Private' },
    { value: 'paid', name: 'Paid' },
  ];
  constructor(
    public matDialog: MatDialogRef<CourseFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: CommonAPIService, private errorHandlingService: ErrorHandlingService,
    public matcher: ErrorStateMatcherService, private fb: FormBuilder,
    private alertService: AlertService) {

    this.isViewOnly = data.isViewOnly;
    this.courseForm = this.fb.group({
      name: [data.name || '', [Validators.required, Validators.pattern('^[a-zA-Z0-9 \s]*$')]],
      type: [data.type || 'public', Validators.required],
      description: [data.description || '', Validators.required],
      isPublished: [data.isPublished]
    });

    if (data._id) {
      this.courseId = data._id || null;
    }
    this.courseForm['controls']['name'].valueChanges.pipe(debounceTime(500)).subscribe({
      next: (data: any) => {
        this.checkCourseCategoryUniqueness()
      }
    })

  }

  checkCourseCategoryUniqueness() {
    // let formControl = this.courseForm['controls']['name'];
    // if (formControl.valid && formControl.value.trim() && formControl.value.trim() != this.categoryName) {
    //   this.apiCallActive = true;
    //   this.apiService.get(apiConstants.checkCourseUniqueness + formControl.value.trim().toLowerCase()).subscribe({
    //     next: (data:any) => {
    //       this.apiCallActive = false;
    //       if (data.isUnique === false) {
    //         formControl.setErrors({ 'not_unique': true });
    //       } else {
    //         if (this.courseForm.controls['name'].errors) {
    //           delete this.courseForm.controls['name'].errors['not_unique'];
    //         }
    //       }
    //     },
    //     error: (e) => {
    //       this.apiCallActive = false;
    //       this.errorHandlingService.handle(e);
    //     },
    //   });
    // }
  }
  ngOnInit(): void { }
  saveCourse(): void {
    if (this.courseForm.valid) {
      this.apiCallActive = true;
      let payload: any = {
        type: this.courseForm.value.type,
        name: this.courseForm.value.name.trim().toLowerCase(),
        description: this.courseForm.value.description,
        isPublished: this.courseForm.value.isPublished,
      }
      let apiUrl = apiConstants.createCourse;
      let apiCall = this.apiService.post(apiUrl, payload);

      if (this.courseId) {
        apiUrl += "/" + this.courseId;
        apiCall = this.apiService.put(apiUrl, payload)
      }
      apiCall.subscribe({
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
}
