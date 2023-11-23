import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  baseUrl = environment.baseUrl;
  toggle: boolean = false;
  isViewOnly: any;
  couponId: any;
  categoryName: any;
  couponForm!: FormGroup;
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
    { value: 'free', name: 'Free' },
    { value: 'percentage', name: 'Percentage' },
    { value: 'fixed', name: 'Amount' },
  ];
  constructor(
    public matDialog: MatDialogRef<CouponFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: CommonAPIService,
    private errorHandlingService: ErrorHandlingService,
    public matcher: ErrorStateMatcherService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private http: HttpClient
  ) {
    this.getAllCourses(data);

    this.isViewOnly = data.isViewOnly;
    this.couponForm = this.fb.group({
      course: [data.course || '', Validators.required],
      name: [
        data.name || '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9&-]*$')],
      ],
      valueType: [data.valueType || 'free', Validators.required],
      value: [data.value, Validators.required],
      usageLimit: [
        data.usageLimit || '',
        [Validators.required, Validators.pattern(/^[0-9]+$/)],
      ],
      status: [
        data.status != null || data.status != undefined ? data.status : true,
      ],
      isUnlimited: [data.usageLimit == 0 ? true : false],
    });
    this.typeUpdated(data.valueType || 'free');

    if (data._id) {
      this.couponId = data._id || null;
      if (!data.usageLimit) {
        this.couponForm['controls']['isUnlimited'].setValue(true);
        this.isUnlimited = true;
        this.couponForm['controls']['usageLimit'].setValue(null);
        this.couponForm['controls']['usageLimit'].setValidators([]);
        this.couponForm['controls']['usageLimit'].updateValueAndValidity();
      }
    }
    // this.couponForm['controls']['name'].valueChanges
    //   .pipe(debounceTime(500))
    //   .subscribe({
    //     next: (data: any) => {
    //       this.checkCouponCategoryUniqueness();
    //     },
    //   });
    this.couponForm['controls']['isUnlimited'].valueChanges.subscribe({
      next: (value: any) => {
        this.isUnlimited = value;
        if (value) {
          this.couponForm['controls']['usageLimit'].setValue(null);
          this.couponForm['controls']['usageLimit'].setValidators([]);
          this.couponForm['controls']['usageLimit'].updateValueAndValidity();
        } else {
          this.couponForm['controls']['usageLimit'].setValidators([
            Validators.required,
            Validators.pattern(/^[0-9]+$/),
          ]);
          this.couponForm['controls']['usageLimit'].updateValueAndValidity();
        }
      },
    });

    this.couponForm['controls']['course'].valueChanges.subscribe({
      next: (value: any) => {
        this.selectedCourse =
          this.allCourses.filter((course: any) => course._id == value)?.[0] ||
          {};
      },
    });
    this.couponForm['controls']['valueType'].valueChanges.subscribe({
      next: (value: any) => {
        this.typeUpdated(value);
      },
    });
    // this.couponForm['controls']['value'].valueChanges.subscribe({
    //   next: (value: any) => {
    //     this.priceCheck();
    //   },
    // });
    // this.couponForm['controls']['course'].valueChanges.subscribe({
    //   next: (value: any) => {
    //     this.priceCheck(value);
    //   },
    // });
  }
  priceCheck() {
    let value = this.couponForm['controls']['value'].value;

    if (this.selectedType === 'fixed') {
      console.log(
        value,
        this.selectedCourse.price,
        parseInt(value) > parseInt(this.selectedCourse.price)
      );
      if (
        value &&
        this.selectedCourse &&
        parseInt(value) > parseInt(this.selectedCourse.price)
      ) {
        let formControl = this.couponForm['controls']['value'];
        formControl.setErrors({ max_value: true });
        this.couponForm['controls']['value'].updateValueAndValidity();
        console.log('errorr', this.couponForm.get('value'));
      } else {
        if (this.couponForm.controls['value'].errors) {
          delete this.couponForm.controls['value'].errors['max_value'];
        }
      }
    } else {
      if (this.couponForm.controls['value'].errors) {
        delete this.couponForm.controls['value'].errors['max_value'];
      }
    }
    this.couponForm['controls']['value'].updateValueAndValidity();
  }
  customMaxValueValidator(control: AbstractControl) {
    if (this.selectedCourse?.price) {
      const inputValue = control.value;
      const maxValue = parseInt(this.selectedCourse.price);
      if (inputValue > maxValue) {
        return { max_value: true };
      }
    }
    return null;
  }
  selectedCourse: any = null;
  selectedType: any = '';
  isUnlimited: boolean = false;
  typeUpdated(value: any) {
    this.selectedType = value;
    switch (value) {
      case 'percentage':
        this.setValidators([
          Validators.required,
          Validators.pattern(/^(100(\.0{1,2})?|\d{0,2}(\.\d{1,2})?)$/),
        ]);
        break;
      case 'fixed':
        this.setValidators([
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          this.customMaxValueValidator.bind(this),
        ]);
        break;
      default:
        this.setValidators([]);
        break;
    }
  }
  setValidators(validators: any) {
    this.couponForm['controls']['value'].setValidators(validators);
    this.couponForm['controls']['value'].updateValueAndValidity();
  }
  allCourses: any = [];
  getAllCourses(data: any) {
    this.apiCallActive = true;
    this.apiService.get(apiConstants.allCourses).subscribe({
      next: (result: any) => {
        this.apiCallActive = false;

        this.allCourses = result.courses;
        // console.log(this.allCourses, data.course);
        this.couponForm.controls['course'].setValue(data.course?._id);
        console.log(this.couponForm);
        this.priceCheck();
      },
      error: (e) => {
        this.apiCallActive = false;
        this.errorHandlingService.handle(e);
      },
    });
  }
  checkCouponCategoryUniqueness() {
    let formControl = this.couponForm['controls']['name'];
    let course = this.couponForm['controls']['course'].value;
    if (course && formControl.valid) {
      this.apiCallActive = true;
      this.apiService
        .get(
          apiConstants.checkCouponUniqueness.replace(':id', course) +
            formControl.value.trim().toLowerCase()
        )
        .subscribe({
          next: (data: any) => {
            this.apiCallActive = false;
            if (data.isUnique === false) {
              formControl.setErrors({ not_unique: true });
            } else {
              if (this.couponForm.controls['name'].errors) {
                delete this.couponForm.controls['name'].errors['not_unique'];
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
  ngOnInit(): void {}
  saveCoupon(): void {
    if (this.couponForm.valid) {
      this.apiCallActive = true;
      let value = this.couponForm.value;
      let payload: any = {
        name: value.name.trim().toLowerCase(),
        valueType: value.valueType,
        value: value.value,
        usageLimit: value.usageLimit,
        status: value.status,
        course: value.course,
      };
      let apiUrl = apiConstants.createCoupon;
      let apiCall = this.apiService.post(apiUrl, payload);

      if (this.couponId) {
        apiUrl += '/' + this.couponId;
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
