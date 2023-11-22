import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { ConfirmDialogComponent } from 'src/app/views/common/confirm-dialog/confirm-dialog.component';
import { CommentComponent } from '../comment/comment.component';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CourseDetailsComponent implements OnInit {
  addUserDialogRef: any;
  activeSlide: number = 1;
  dataSource: any;
  apiCallActive: boolean = true;
  selectedCourseId: any;
  rootComments: any = [];
  constructor(
    private apiService: CommonAPIService,
    public dialog: MatDialog,
    private errorHandlingService: ErrorHandlingService,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute
  ) {
    this.activeRoute.params.subscribe({
      next: (route) => {
        this.selectedCourseId = route['id'];
        this.getCourseDetails();
      },
    });
  }
  ngOnInit(): void {}

  manageCourseVisibility(course: any) {
    this.openConfirmDialog(course, {
      course,
      type: 'visibility',
      heading: (course.isPublished ? 'Unpublish' : 'Publish') + ' Course',
      message:
        'Are you sure you want to ' +
        (course.isPublished ? 'un' : '') +
        'publish this course?',
    });
  }
  addCourseDialogRef: any;
  openConfirmDialog(course: any, dialogData: any = {}): void {
    this.addCourseDialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '320px',
      width: '585px',
      disableClose: true,
      data: dialogData,
    });
    this.addCourseDialogRef.afterClosed().subscribe({
      next: (data: any) => {
        if (data) {
          this.manageCourse(course);
        }
      },
    });
  }
  manageCourse(course: any) {
    this.apiService
      .put(apiConstants.manageCourseAccess + course._id, {
        isPublished: !course.isPublished,
      })
      .subscribe({
        next: (data) => {
          // if (data.statusCode === 201 || data.statusCode === 200) {
          this.courseDetails.isPublished = data.course.isPublished;

          this.alertService.notify(data.message);
          // } else {
          //   this.errorHandlingService.handle(data);
          // }
        },
        error: (e) => this.errorHandlingService.handle(e),
      });
  }
  courseDetails: any;
  getCourseDetails() {
    this.apiCallActive = true;
    this.apiService
      .get(apiConstants.getCourseDetails + this.selectedCourseId)
      .subscribe({
        next: (data) => {
          this.apiCallActive = false;
          this.courseDetails = data.course;
          this.rootComments = this.courseDetails.rootComments;
          // if (data.statusCode === 200) {
          // this.dataSource = new MatTableDataSource<any>(data.response?.courses || []);
          // this.selectedCourseCategoryDoc = data.response?.category || {};
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
}
