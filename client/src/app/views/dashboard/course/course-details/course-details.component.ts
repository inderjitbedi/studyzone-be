import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {
  addUserDialogRef: any;

  dataSource: any;
  apiCallActive: boolean = true;
  selectedCourseId: any;
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
        this.getCourses();
      }
    })
  }
  ngOnInit(): void {

  }

  openCourseForm(isViewOnly: boolean, courseData: any = {}): void {
    // this.addUserDialogRef = this.dialog.open(CourseFormComponent, {
    //   minWidth: '320px',
    //   width: '585px',
    //   disableClose: true,
    //   data: { isViewOnly, ...courseData, selectedCoFaqurseCategory: this.selectedCourseCategory },
    // });
    // this.addUserDialogRef.afterClosed().subscribe({
    //   next: (data: any) => {
    //     if (data) {
    //       this.getCourses();
    //     }
    //   },
    // });
  }
  courseDetails: any;
  getCourses() {

    this.apiCallActive = true;
    this.apiService.get(apiConstants.getCourseDetails + this.selectedCourseId).subscribe({
      next: (data) => {
        this.apiCallActive = false;
        this.courseDetails = data.course;
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

  deleteCourse(index: number, course: any) {
    if (window.confirm('Are you sure you want to delete this?')) {
      this.apiService.put(apiConstants.updateCourse, { id: course._id }).subscribe({
        next: (data) => {
          // if (data.statusCode === 201 || data.statusCode === 200) {
          const srcData = this.dataSource.data;
          srcData.splice(index, 1);
          this.dataSource.data = srcData;
          this.alertService.notify(data.message);
          // } else {
          //   this.errorHandlingService.handle(data);
          // }
        },
        error: (e) => this.errorHandlingService.handle(e),
      });
    }
  }




  //new code


}
