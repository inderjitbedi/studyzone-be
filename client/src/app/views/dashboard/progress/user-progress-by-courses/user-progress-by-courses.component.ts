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
// import { CourseFormComponent } from '../course-form/course-form.component';

@Component({
  selector: 'app-user-progress-by-courses',
  templateUrl: './user-progress-by-courses.component.html',
  styleUrls: ['./user-progress-by-courses.component.scss']
})
export class UserProgressByCoursesComponent implements OnInit {
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
    public router: Router, private _location: Location
  ) {
    this.displayedColumns = ['id', 'coursename', 'username', 'email', 'enrolledOn', 'progress', 'lastActivity'];
    this.activeRoute.params.subscribe({
      next: ({ type }) => {
        this.currentUrl = this.router.url
        this.getProgress(type);
      }
    })
    this.navLinks = [
      {
        label: 'Public',
        link: '/dashboard/progress/course/public',
        index: 0
      }, {
        label: 'Private',
        link: '/dashboard/progress/course/private',
        index: 1
      }, {
        label: 'Paid',
        link: '/dashboard/progress/course/paid',
        index: 2
      },
    ];
  }
  currentUrl: any = ''
  updateUrl(navLink: any) {
    this._location.go(navLink.link);
    this.currentUrl = navLink.link
    this.getProgress(navLink.label.toLowerCase());
  }
  navLinks: any[];
  activeLinkIndex = -1;
  ngOnInit(): void {
    // for reloading current page 
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false
    }
  }


  getProgress(courseType: string = 'public') {

    this.apiCallActive = true;
    this.apiService.get(apiConstants.analytics.replace(':type', courseType)).subscribe({
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
}
