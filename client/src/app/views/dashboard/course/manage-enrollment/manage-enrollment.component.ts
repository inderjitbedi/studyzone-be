import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { ConfirmDialogComponent } from 'src/app/views/common/confirm-dialog/confirm-dialog.component';
import { CourseFormComponent } from '../course-form/course-form.component';
import { NewEnrollmentComponent } from '../new-enrollment/new-enrollment.component';

@Component({
  selector: 'manage-enrollment',
  templateUrl: './manage-enrollment.component.html',
  styleUrls: ['./manage-enrollment.component.scss']
})
export class ManageEnrollmentComponent implements OnInit {

  addCourseDialogRef: any;
  displayedColumns!: string[];
  dataSource: any;
  apiCallActive: boolean = true;
  selectedCourseId: any;

  @Input() courseDetails: any;
  constructor(
    private apiService: CommonAPIService,
    public dialog: MatDialog,
    private errorHandlingService: ErrorHandlingService,
    private alertService: AlertService,
  ) {

    // this.activeRoute.params.subscribe({
    //   next: ({ id }: any) => {
    //     this.selectedCourseId = id

    //   }
    // })
  }

  ngOnInit(): void {
    // if (this.courseDetails.type == 'paid') {
      this.displayedColumns = ['id', 'user', 'email', 'enrolledOn']//, 'action'];
    // } else
    //   this.displayedColumns = ['id', 'user', 'email', 'enrolledOn', 'progress', 'action'];
    this.selectedCourseId = this.courseDetails._id
    this.getEnrolledUsers();
  }

  getEnrolledUsers() {
    // 
    this.apiCallActive = true;
    this.apiService.get(apiConstants.getEnrollments.replace(':id', this.selectedCourseId)).subscribe({
      next: (data) => {
        this.apiCallActive = false;
        // if (data.statusCode === 200) {
        this.dataSource = new MatTableDataSource<any>(data.enrollments || []);
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


  manageCourseVisibility(index: number, course: any) {
    this.openConfirmDialog(index, course,
      {
        course,
        type: 'visibility',
        heading: (course.isPublished ? "Unpublish" : "Publish") + " Course",
        message: "Are you sure you want to " + (course.isPublished ? "un" : "") + "publish this course?"
      }
    )
  }

  // manageCourseVisibility(element,$event.checked)
  openConfirmDialog(index: number, course: any, dialogData: any = {}): void {
    this.addCourseDialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '320px',
      width: '585px',
      disableClose: true,
      data: dialogData
    });
    this.addCourseDialogRef.afterClosed().subscribe({
      next: (data: any) => {
        if (data) {
          this.manageCourse(index, course)
        }
      }
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

  openEnrollUserForm(): void {
    this.addCourseDialogRef = this.dialog.open(NewEnrollmentComponent, {
      minWidth: '320px',
      width: '585px',
      disableClose: true,
      data: { courseId: this.selectedCourseId },
    });
    this.addCourseDialogRef.afterClosed().subscribe({
      next: (data: any) => {
        if (data) {
          this.getEnrolledUsers()
        }
      },
    });
  }
}
