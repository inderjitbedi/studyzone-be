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
  selector: 'app-slide-form',
  templateUrl: './slide-form.component.html',
  styleUrls: ['./slide-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SlideFormComponent implements OnInit {
  apiKey: any = '2s5r3no6j3vom8zxctikpv6sh6s2j7qe8p277t61yl1h7boh';
  setting: any = {
    plugins:
      'anchor autolink emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss',
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
    public matDialog: MatDialogRef<SlideFormComponent>,
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
    console.log(data);

    this.slideForm = this.fb.group({
      name: [
        data.name || '',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9 s]*$')],
      ],
      type: [data.type || 'text', Validators.required],
      text: [data.text || ''],
      file: [''],
      // isPublished: [data.isPublished]
    });
    console.log(this.slideForm.value);

    this.selectedSlideDetails = data;
    this.courseId = data.courseId;
    this.selectedType = data.type || 'text';
    if (data._id) {
      this.slideId = data._id || null;
      this.typeUpdated(data.type);
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
        this.typeUpdated(value);
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

  clearOthers(key: any) {
    if (this.selectedSlideDetails[key]) {
      this.slideForm['controls'][key].setValue(this.selectedSlideDetails[key]);
      this.slideForm['controls'][key].updateValueAndValidity();
    }
    // this.types.forEach(type => {
    if (key != 'text') {
      this.fileObject = {};
      this.uploadingInProgess = false;
      this.uploadingProgress = 0;
      this.attachment = null;
      this.slideForm['controls']['file'].setValue('');
      this.slideForm['controls']['file'].setValidators([]);
      this.slideForm['controls']['file'].updateValueAndValidity();
    } else {
      if (!this.selectedSlideDetails?.text)
        this.slideForm['controls']['text'].setValue('');
      this.slideForm['controls']['text'].setValidators([]);
      this.slideForm['controls']['text'].updateValueAndValidity();
    }
    // })
  }
  selectedType: any = 1;
  selectedFileSettings: any = {};
  setValidators(key: any, validators: any) {
    this.slideForm['controls'][key].setValidators(validators);
    this.slideForm['controls'][key].updateValueAndValidity();
    this.clearOthers(key);
  }
  typeUpdated(value: any) {
    this.selectedType = value;
    switch (value) {
      case 'text':
        this.selectedFileSettings = {};
        this.setValidators(value, [Validators.required]);
        break;
      default:
        this.selectedFileSettings = this.fileSettings.filter(
          (config: any) => config.name === value
        );
        this.selectedFileSettings = this.selectedFileSettings[0];
        this.setValidators('file', [Validators.required]);
        break;
    }
  }
  fileSettings: any = [
    {
      name: 'video',
      maxSize: 200, //200MB
      mimeTypes: 'video/mp4,video/webm,video/ogg',
      extensions: ['mp4', 'ogg', 'webm'],
      fileType: 'MP4, WebM or OGG',
      key: 'file',
    },
    {
      name: 'audio',
      maxSize: 200, //200MB
      mimeTypes: 'audio/mpeg,audio/ogg,audio/wav',
      extensions: ['mp3', 'ogg', 'wav'],
      fileType: 'MP3, OGG or WAV',
    },
    {
      name: 'pdf',
      maxSize: 100, //100MB
      mimeTypes: 'application/pdf',
      extensions: ['pdf'],
      fileType: 'PDF',
    },
  ];

  uploadFiles($event: any): void {
    if ($event.target.value) {
      const file = $event.target.files[0];
      this.fileObject.fileName = file.name;
      this.fileObject.fileExtension = file.name
        .split('.')
        [file.name.split('.').length - 1].toLowerCase();
      this.fileObject.fileSize = file.size;
      const allowedFileExtentions = this.selectedFileSettings.extensions;
      if (
        !allowedFileExtentions.find(
          (format: any) => format === this.fileObject.fileExtension
        )
      ) {
        this.alertService.notify(
          'Please make sure your file is in one of these formats: ' +
            allowedFileExtentions,
          'info'
        );
      } else if (
        this.fileObject.fileSize >
        this.selectedFileSettings.maxSize * 1000000
      ) {
        this.alertService.notify(
          `Please make sure your file is less than ${this.selectedFileSettings.maxSize} MB in size.`,
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
      .post(
        environment.baseUrl +
          apiConstants.uploadFile +
          this.selectedFileSettings.name,
        formData,
        {
          reportProgress: true,
          observe: 'events',
        }
      )
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
              // if (event.body.statusCode === 200) {
              const file = event.body.file;
              console.log(file);

              this.attachment = {
                ...file,
              };
              this.slideForm.controls['file'].setValue(
                [this.attachment.destination, this.attachment.name].join('/')
              );
              // } else {
              //   this.errorHandlingService.handle(event.body);
              // }
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

  // /file/upload/:type
}
