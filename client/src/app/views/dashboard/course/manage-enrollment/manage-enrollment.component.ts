import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { ConfirmDialogComponent } from 'src/app/views/common/confirm-dialog/confirm-dialog.component';
import { NewEnrollmentComponent } from '../new-enrollment/new-enrollment.component';

@Component({
  selector: 'manage-enrollment',
  templateUrl: './manage-enrollment.component.html',
  styleUrls: ['./manage-enrollment.component.scss']
})
export class ManageEnrollmentComponent implements OnInit {

  addEnrollmentDialogRef: any;
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
  ) { }

  ngOnInit(): void {
    if (this.courseDetails?.type == 'paid')
      this.displayedColumns = ['id', 'user', 'email', 'enrolledOn', 'requestStatus', 'action'];
    else
      this.displayedColumns = ['id', 'user', 'email', 'enrolledOn', 'action'];
    this.selectedCourseId = this.courseDetails._id
    this.getEnrolledUsers();
  }

  getEnrolledUsers() {
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

  openConfirmDialog(index: number, enrollment: any, dialogData: any = {}): void {
    this.addEnrollmentDialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '320px',
      width: '585px',
      disableClose: true,
      data: {
        enrollment,
        heading: "Remove Enrollment",
        message: "Are you sure you want to remove this enrollment?"
      }
    });
    this.addEnrollmentDialogRef.afterClosed().subscribe({
      next: (data: any) => {
        if (data) {
          this.manageEnrollment(index, enrollment)
        }
      }
    });
  }

  manageEnrollment(index: number, enrollment: any) {
    console.log(enrollment);

    this.apiService.put(apiConstants.manageEnrollment.replace(':id', this.selectedCourseId).replace(':enrollmentId', enrollment._id), { isDeleted: true }).subscribe({
      next: (data) => {
        // if (data.statusCode === 201 || data.statusCode === 200) {
        this.dataSource.data.splice(index, 1);
        // this.dataSource = new MatTableDataSource<any>([]);
        this.dataSource = new MatTableDataSource<any>(this.dataSource.data || []);
        // this.alertService.notify(data.message);
        // } else {
        //   this.errorHandlingService.handle(data);
        // }
      },
      error: (e) => this.errorHandlingService.handle(e),
    });
  }

  openEnrollUserForm(): void {
    this.addEnrollmentDialogRef = this.dialog.open(NewEnrollmentComponent, {
      minWidth: '320px',
      width: '585px',
      disableClose: true,
      data: { enrollmentId: this.selectedCourseId },
    });
    this.addEnrollmentDialogRef.afterClosed().subscribe({
      next: (data: any) => {
        if (data) {
          this.getEnrolledUsers()
        }
      },
    });
  }
}
