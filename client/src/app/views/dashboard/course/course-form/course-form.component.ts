import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { ErrorStateMatcherService } from 'src/app/providers/error-matcher.service';
import { debounceTime, map } from 'rxjs/operators';
import { Constants } from 'src/app/providers/constant';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CourseFormComponent implements OnInit {
  baseUrl = environment.baseUrl;
  toggle: boolean = false;
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
    public matDialog: MatDialogRef<CourseFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: CommonAPIService,
    private errorHandlingService: ErrorHandlingService,
    public matcher: ErrorStateMatcherService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private http: HttpClient
  ) {
    this.isViewOnly = data.isViewOnly;
    this.courseForm = this.fb.group({
      name: [
        data.name || '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9& -]*$')],
      ],
      type: [data.type || 'public', Validators.required],
      description: [data.description || '', Validators.required],
      isPublished: [data.isPublished],
      cover: ['', Validators.required],
    });

    if (data._id) {
      this.courseId = data._id || null;
      this.attachment = data.cover ? { ...data.cover } : {};
      this.courseForm.controls['cover'].setValue(
        [this.attachment.destination, this.attachment.name].join('/')
      );
      console.log(this.courseForm.controls['cover'].value);
    }
    this.courseForm['controls']['name'].valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (data: any) => {
          this.checkCourseCategoryUniqueness();
        },
      });
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
  ngOnInit(): void {}
  saveCourse(): void {
    if (this.courseForm.valid) {
      this.apiCallActive = true;
      let payload: any = {
        type: this.courseForm.value.type,
        name: this.courseForm.value.name.trim().toLowerCase(),
        description: this.courseForm.value.description,
        isPublished: this.courseForm.value.isPublished,
        cover: this.attachment._id,
      };
      let apiUrl = apiConstants.createCourse;
      let apiCall = this.apiService.post(apiUrl, payload);

      if (this.courseId) {
        apiUrl += '/' + this.courseId;
        apiCall = this.apiService.put(apiUrl, payload);
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
        },
      });
    }
  }

  uploadFiles($event: any): void {
    if ($event.target.value) {
      const file = $event.target.files[0];
      this.fileObject.fileName = file.name;
      this.fileObject.fileExtension = file.name
        .split('.')
        [file.name.split('.').length - 1].toLowerCase();
      this.fileObject.fileSize = file.size;
      const allowedFileExtentions = Constants.allowedImageFileExtentions;
      if (
        !allowedFileExtentions.find(
          (format) => format === this.fileObject.fileExtension
        )
      ) {
        this.alertService.notify(
          'Please make sure your file is in one of these formats: ' +
            allowedFileExtentions,
          'info'
        );
      } else if (this.fileObject.fileSize > Constants.maximumFileSize) {
        this.alertService.notify(
          `Please make sure your file is less than ${
            Constants.maximumFileSize / 1000000
          } MB in size.`,
          'info'
        );
      } else {
        const formData = new FormData();
        formData.append('file', file);
        this.uploadFile(formData);
      }
    }
  }
  uploadFile(formData: any): any {
    this.uploadingInProgess = true;
    this.apiCallActive = true;
    this.attachment = null;
    this.http
      .post(environment.baseUrl + apiConstants.uploadFile + 'cover', formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event: any) => {
          switch (event.type) {
            case HttpEventType.Sent:
              break;
            case HttpEventType.ResponseHeader:
              this.uploadingInProgess = false;
              this.apiCallActive = false;
              break;
            case HttpEventType.UploadProgress:
              this.uploadingProgress = Math.round(
                (event.loaded / event.total) * 100
              );
              break;
            case HttpEventType.Response:
              this.apiCallActive = false;
              if (event.status === 201 || event.status === 201) {
                const file = event.body.file;
                this.attachment = {
                  ...file,
                };
                this.courseForm.controls['cover'].setValue(
                  [this.attachment.destination, this.attachment.name].join('/')
                );
              } else {
                this.errorHandlingService.handle(event.body);
              }
              setTimeout(() => {
                this.uploadingProgress = 0;
              }, 500);
          }
        })
      )
      .subscribe();
  }
  formatBytes(bytes: any, decimals = 2): any {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024,
      dm = decimals <= 0 ? 0 : decimals || 2,
      sizes = ['Bytes', 'KB', 'MB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      '(' +
      parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) +
      ' ' +
      sizes[i] +
      ')'
    );
  }
}
