import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { ConfirmDialogComponent } from 'src/app/views/common/confirm-dialog/confirm-dialog.component';
import { environment } from 'src/environments/environment';
import { CourseFormComponent } from '../course-form/course-form.component';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class CourseListComponent implements OnInit {
  baseUrl: any = environment.baseUrl;

  addCourseDialogRef: any;
  displayedColumns: string[];
  courses: any = [];
  apiCallActive: boolean = true;
  constructor(
    private apiService: CommonAPIService,
    public dialog: MatDialog,
    private errorHandlingService: ErrorHandlingService,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute,
    public router: Router,
    private _location: Location
  ) {
    this.displayedColumns = ['id', 'name', 'type', 'isPublished', 'action'];
    this.activeRoute.params.subscribe({
      next: ({ type }) => {
        this.currentUrl = this.router.url;
        this.getCourses(type);
      },
    });
    this.navLinks = [
      {
        label: 'Public',
        link: '/dashboard/course/list/public',
        index: 0,
      },
      {
        label: 'Private',
        link: '/dashboard/course/list/private',
        index: 1,
      },
      {
        label: 'Paid',
        link: '/dashboard/course/list/paid',
        index: 2,
      },
    ];
  }
  currentUrl: any = '';
  updateUrl(navLink: any) {
    this._location.go(navLink.link);
    this.currentUrl = navLink.link;
    this.getCourses(navLink.label.toLowerCase());
  }
  navLinks: any[];
  activeLinkIndex = -1;
  ngOnInit(): void {
    // for reloading current page
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  delete(index: number, course: any) {
    this.openConfirmDialog(index, course, {
      course,
      heading: 'Delete course',
      type: 'delete',
      message: 'Are you sure you want to delete this course?',
    });
  }
  manageCourseVisibility(index: number, course: any) {
    this.openConfirmDialog(index, course, {
      course,
      type: 'visibility',
      heading: (course.isPublished ? 'Unpublish' : 'Publish') + ' Course',
      message:
        'Are you sure you want to ' +
        (course.isPublished ? 'un' : '') +
        'publish this course?',
    });
  }

  // manageCourseVisibility(element,$event.checked)
  openConfirmDialog(index: number, course: any, dialogData: any = {}): void {
    this.addCourseDialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '320px',
      width: '585px',
      disableClose: true,
      data: dialogData,
    });
    this.addCourseDialogRef.afterClosed().subscribe({
      next: (data: any) => {
        if (data) {
          if (dialogData.type == 'delete') {
            this.deleteCourse(index, course);
          } else this.manageCourse(index, course);
        }
      },
    });
  }
  openAddCourseForm(isViewOnly: boolean, course: any = {}): void {
    this.addCourseDialogRef = this.dialog.open(CourseFormComponent, {
      minWidth: '520px',
      width: '585px',
      disableClose: true, 
      data: { isViewOnly, ...course },
    });
    this.addCourseDialogRef.afterClosed().subscribe({
      next: (data: any) => {
        if (data) {
          this.router.navigate(
            ['/dashboard/course/list/' + (data?.course?.type || 'public')],
            { skipLocationChange: true }
          );
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
        this.courses = data.courses || [];
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
    this.apiService
      .put(apiConstants.manageCourseAccess + course._id, {
        isPublished: !course.isPublished,
      })
      .subscribe({
        next: (data) => {
          // if (data.statusCode === 201 || data.statusCode === 200) {
          this.courses[index].isPublished = data.course.isPublished;

          this.alertService.notify(data.message);
          // } else {
          //   this.errorHandlingService.handle(data);
          // }
        },
        error: (e) => this.errorHandlingService.handle(e),
      });
  }

  deleteCourse(index: number, course: any) {
    this.apiService
      .put(apiConstants.deleteCourse.replace(':id', course._id), {
        isDeleted: true,
      })
      .subscribe({
        next: (data) => {
          // if (data.statusCode === 201 || data.statusCode === 200) {
          this.courses.splice(index, 1);
          // this.dataSource = new MatTableDataSource<any>(
          //   this.dataSource.data || []
          // );
          this.alertService.notify(data.message);
          // } else {
          //   this.errorHandlingService.handle(data);
          // }
        },
        error: (e) => this.errorHandlingService.handle(e),
      });
  }
}
