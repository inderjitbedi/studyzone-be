import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { ConfirmDialogComponent } from 'src/app/views/common/confirm-dialog/confirm-dialog.component';
import { CourseFormComponent } from '../course-form/course-form.component';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class CourseListComponent implements OnInit {
  addCourseDialogRef: any;
  displayedColumns: string[];
  dataSource: any;
  apiCallActive: boolean = true;
  constructor(
    private apiService: CommonAPIService,
    public dialog: MatDialog,
    private errorHandlingService: ErrorHandlingService,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {
    this.displayedColumns = ['id', 'name', 'type', 'isPublished', 'action'];

    this.activeRoute.params.subscribe({
      next: ({ type }) => {

        this.getCourses(type);
      }
    })
    this.navLinks = [
      {
        label: 'Public',
        link: '/dashboard/course/list/public',
        index: 0
      }, {
        label: 'Private',
        link: '/dashboard/course/list/private',
        index: 1
      }, {
        label: 'Paid',
        link: '/dashboard/course/list/paid',
        index: 2
      },
    ];
  }
  navLinks: any[];
  activeLinkIndex = -1;
  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false
    }
  }
  // manageCourseVisibility(element,$event.checked)
  openConfirmDialog($event: any, index: number, course: any): void {
    this.addCourseDialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '320px',
      width: '585px',
      disableClose: true,
      data: { course, heading: (course.isPublished ? "Unpublish" : "Publish") + " Course", message: "Are you sure you want to " + (course.isPublished ? "un" : "") + "publish this course?" },
    });
    this.addCourseDialogRef.afterClosed().subscribe({
      next: (data: any) => {
        if (data) {
          this.manageCourse(index, course)
        }
      },
    });
  }
  openAddCourseForm(isViewOnly: boolean, course: any = {}): void {
    this.addCourseDialogRef = this.dialog.open(CourseFormComponent, {
      minWidth: '320px',
      width: '585px',
      disableClose: true,
      data: { isViewOnly, ...course },
    });
    this.addCourseDialogRef.afterClosed().subscribe({
      next: (data: any) => {
        if (data) {
          this.router.navigate(['/dashboard/course/list/' + (data?.course?.type || 'public')], { skipLocationChange: true })
          // this.getCourses(data.course.type);
        }
      },
    });
  }
  getCourses(type: string = 'public') {

    this.apiCallActive = true;
    this.apiService.get(apiConstants.course + type).subscribe({
      next: (data) => {
        this.apiCallActive = false;
        // if (data.statusCode === 200) {
        this.dataSource = new MatTableDataSource<any>(data.courses || []);
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
  manageCourse(index: number, course: any) {
    this.apiService.put(apiConstants.manageCourseAccess + course._id, { isPublished: !course.isPublished }).subscribe({
      next: (data) => {
        // if (data.statusCode === 201 || data.statusCode === 200) {
        this.dataSource.data[index].isPublished = data.course.isPublished;

        this.alertService.notify(data.message);
        // } else {
        //   this.errorHandlingService.handle(data);
        // }
      },
      error: (e) => this.errorHandlingService.handle(e),
    });
  }
  // deleteCourse(index: number, course: any) {
  //   this.apiService.put(apiConstants.manageCourseAccess + course._id, { isPublished: !course.isPublished }).subscribe({
  //     next: (data) => {
  //       // if (data.statusCode === 201 || data.statusCode === 200) {
  //       this.dataSource.data[index].isPublished = data.course.isPublished;

  //       this.alertService.notify(data.message);
  //       // } else {
  //       //   this.errorHandlingService.handle(data);
  //       // }
  //     },
  //     error: (e) => this.errorHandlingService.handle(e),
  //   });
  // }
}
