import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
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
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-coupon-form',
  templateUrl: './coupon-form.component.html',
  styleUrls: ['./coupon-form.component.scss'],
})
export class CouponFormComponent implements OnInit {
  apiKey: any = '2s5r3no6j3vom8zxctikpv6sh6s2j7qe8p277t61yl1h7boh';
  setting: any = {
    plugins:
      'anchor autolink image link lists media searchreplace table visualblocks wordcount',
    // toolbar:
    //   'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
    tinycomments_mode: 'embedded',
  };
  environment = environment;
  toggle: boolean = false;
  isViewOnly: any;
  slideId: any;
  slideForm: FormGroup;
  apiCallActive: boolean = false;
  nameMaxLength: number = 50;
  slideList: any = [];
  color: any = '#039ee3';
  isUnique: boolean = true;
  fileObject: any = {};
  uploadingInProgess: boolean = false;
  uploadingProgress: any;
  attachment: any = null;
  types: any[] = [
    'text',
    'video',
    'audio',
    'pdf',
    // { value: 'text', name: 'Public' },
    // { value: 'video', name: 'Private' },
    // { value: 'paid', name: 'Paid' },
  ];
  selectedSlideDetails: any;
  courseId: any;
  constructor(
    public matDialog: MatDialogRef<CouponFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: CommonAPIService,
    private errorHandlingService: ErrorHandlingService,
    public matcher: ErrorStateMatcherService,
    private fb: FormBuilder,
    private http: HttpClient,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute
  ) {
    this.isViewOnly = data.isViewOnly;
    // console.log(data);

    this.slideForm = this.fb.group({
      name: [
        data.name || '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9& -]*$')],
      ],
      type: [data.type || 'text', Validators.required],
      text: [data.text || ''],
      file: [''],
      // isPublished: [data.isPublished]
    });
    // console.log(this.slideForm.value);

    this.selectedSlideDetails = data;
    this.courseId = data.courseId;
    // this.selectedType = data.type || 'text';
    if (data._id) {
      this.slideId = data._id || null;
      if (data.file) {
        this.attachment = data.file ? { ...data.file } : {};
        this.slideForm.controls['file'].setValue(
          [this.attachment.destination, this.attachment.name].join('/')
        );
      }
    }

    this.slideForm['controls']['name'].valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (value: any) => {
          this.checkSlideUniqueness();
        },
      });
    this.slideForm['controls']['type'].valueChanges.subscribe({
      next: (value: any) => {
        // this.typeUpdated(value);
      },
    });
  }

  checkSlideUniqueness() {
    // let formControl = this.slideForm['controls']['name'];
    // if (formControl.valid && formControl.value.trim() && formControl.value.trim() != this.categoryName) {
    //   this.apiCallActive = true;
    //   this.apiService.get(apiConstants.checkSlideUniqueness + formControl.value.trim().toLowerCase()).subscribe({
    //     next: (data:any) => {
    //       this.apiCallActive = false;
    //       if (data.isUnique === false) {
    //         formControl.setErrors({ 'not_unique': true });
    //       } else {
    //         if (this.slideForm.controls['name'].errors) {
    //           delete this.slideForm.controls['name'].errors['not_unique'];
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
  saveSlide(): void {
    if (this.slideForm.valid) {
      this.apiCallActive = true;
      let payload: any = {
        type: this.slideForm.value.type,
        name: this.slideForm.value.name.trim().toLowerCase(),
        // isPublished: this.slideForm.value.isPublished,
        position:
          this.selectedSlideDetails.position ||
          this.selectedSlideDetails.totalSlides + 1,
      };
      if (payload.type == 'text') {
        payload.text = this.slideForm.value.text;
      } else {
        payload.file = this.attachment._id;
      }
      let apiUrl = apiConstants.createSlide.replace(':id', this.courseId);
      let apiCall = this.apiService.post(apiUrl, payload);

      if (this.slideId) {
        apiUrl += '/' + this.slideId;
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
}
