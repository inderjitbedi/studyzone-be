import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { SlideFormComponent } from '../slide-form/slide-form.component';
import { ConfirmDialogComponent } from 'src/app/views/common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'slide-list',
  templateUrl: './slide-list.component.html',
  styleUrls: ['./slide-list.component.scss'],
})
export class SlideListComponent implements OnInit {
  addSlideDialogRef: any;
  apiCallActive: boolean = false;
  courseId: any;
  rootComments: any = [];
  constructor(
    private apiService: CommonAPIService,
    public dialog: MatDialog,
    private errorHandlingService: ErrorHandlingService,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activeRoute.params.subscribe({
      next: ({ id }) => {
        this.courseId = id;
        this.getSlides();
        // this.getComments();
      },
    });
  }

  ngOnInit(): void {
    // this.openAddSlideForm(false);
  }
  getSlides() {
    let apiUrl = apiConstants.slide.replace(':id', this.courseId);
    this.apiCallActive = true;
    this.apiService.get(apiUrl).subscribe({
      next: (data) => {
        this.apiCallActive = false;
        // if (data.statusCode === 200) {
        this.slides = data.slides || [];
        this.orderedSlides = [...this.slides];
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
  openAddSlideForm(isViewOnly: boolean, slide: any = {}): void {
    this.addSlideDialogRef = this.dialog.open(SlideFormComponent, {
      minWidth: '620px',
      width: '640px',
      disableClose: true,
      data: {
        isViewOnly,
        ...slide,
        totalSlides: this.slides.length,
        courseId: this.courseId,
      },
    });
    this.addSlideDialogRef.afterClosed().subscribe({
      next: (data: any) => {
        if (data) {
          this.router.navigate(['/dashboard/course/details/' + this.courseId], {
            skipLocationChange: true,
          });
          this.getSlides();
        }
      },
    });
  }
  slides: any = [];
  orderedSlides: any = [];
  confirmDialogRef: any;
  delete(index: any) {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '320px',
      width: '585px',
      disableClose: true,
      data: {
        slide: this.slides[index],
        heading: 'Delete slide',
        message: 'Are you sure you want to delete this slide?',
      },
    });
    this.confirmDialogRef.afterClosed().subscribe({
      next: (data: any) => {
        if (data) {
          this.deleteSlide(this.slides[index]._id);
        }
      },
    });
  }
  deleteSlide(slideId: any) {
    this.apiService
      .put(
        apiConstants.updateSlide
          .replace(':id', this.courseId)
          .replace(':slideid', slideId),
        { isDeleted: true }
      )
      .subscribe({
        next: (data) => {
          // if (data.statusCode === 201 || data.statusCode === 200) {
          this.slides = this.slides.filter(
            (slide: any) => slide._id != slideId
          );
          this.alertService.notify('Slide deleted successfully');
          // } else {
          //   this.errorHandlingService.handle(data);
          // }
        },
        error: (e) => this.errorHandlingService.handle(e),
      });
  }
  reorderMode: boolean = false;
  reorderSlides() {
    this.reorderMode = !this.reorderMode;
  }
  cancelReorder() {
    this.reorderMode = false;
    this.slides = [...this.orderedSlides];
  }
  saveOrder() {
    let apiUrl = apiConstants.reorderSildes.replace(':id', this.courseId);
    this.apiCallActive = true;
    this.apiService
      .put(apiUrl, { slides: this.slides.map((slide: any) => slide._id) })
      .subscribe({
        next: (data) => {
          this.apiCallActive = false;
          this.reorderMode = false;
          this.orderedSlides = [...this.slides];
          this.alertService.notify(data.message);
        },
        error: (e) => {
          this.apiCallActive = false;
          this.errorHandlingService.handle(e);
        },
      });
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.slides, event.previousIndex, event.currentIndex);
  }
  // getComments() {
  //   let apiUrl = apiConstants.getCourseDetails + this.courseId//.replace(':id', this.courseId)
  //   this.apiCallActive = true;
  //   this.apiService.get(apiUrl).subscribe({
  //     next: ({ course }) => {
  //       this.apiCallActive = false;
  //       // if (data.statusCode === 200) {
  //       this.rootComments = course.rootComments
  //       // } else {
  //       //   this.errorHandlingService.handle(data);
  //       // }
  //     },
  //     error: (e) => {
  //       this.apiCallActive = false;
  //       this.errorHandlingService.handle(e);
  //     },
  //   });
  // }

  // addComment() {
  //   let apiUrl = apiConstants.addComment.replace(':id', this.courseId)
  //   this.apiCallActive = true;
  //   this.apiService.post(apiUrl, {
  //     "text": "dummy text is the comment done by admin",
  //     "parent": "640ac84ab9761b4e078c0c87"
  //   }).subscribe({
  //     next: ({ course }) => {
  //       this.apiCallActive = false;
  //       // if (data.statusCode === 200) {
  //       this.rootComments = course.rootComments
  //       // } else {
  //       //   this.errorHandlingService.handle(data);
  //       // }
  //     },
  //     error: (e) => {
  //       this.apiCallActive = false;
  //       this.errorHandlingService.handle(e);
  //     },
  //   });
  // }
  // deleteComment() {

  // }
}
