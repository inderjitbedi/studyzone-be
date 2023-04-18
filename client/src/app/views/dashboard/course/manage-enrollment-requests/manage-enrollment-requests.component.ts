import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { ConfirmDialogComponent } from 'src/app/views/common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'manage-enrollment-requests',
  templateUrl: './manage-enrollment-requests.component.html',
  styleUrls: ['./manage-enrollment-requests.component.scss']
})
export class ManageEnrollmentRequestsComponent implements OnInit {

  manageRequestDialogRef: any;
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
    this.displayedColumns = ['id', 'user', 'email', 'enrollmentRequestedOn', 'action'];
    // } else
    //   this.displayedColumns = ['id', 'user', 'email', 'enrolledOn', 'progress', 'action'];
    this.selectedCourseId = this.courseDetails._id
    this.getEnrollmentRequests();
  }

  getEnrollmentRequests() {
    // 
    this.apiCallActive = true;
    this.apiService.get(apiConstants.getEnrollmentRequests.replace(':id', this.selectedCourseId)).subscribe({
      next: (data) => {
        this.apiCallActive = false;
        // if (data.statusCode === 200) {
        this.dataSource = new MatTableDataSource<any>(data.enrollmentRequests || []);
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


  manageRequest(index: number, request: any, action: any) {
    this.openConfirmDialog(index, request,
      {
        request, action,
        heading: (action) + " Enrollment Request",
        message: "Are you sure you want to " + action.toLowerCase() + " this course enrollment request?"
      }
    )
  }

  openConfirmDialog(index: number, request: any, dialogData: any = {}): void {
    this.manageRequestDialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '320px',
      width: '585px',
      disableClose: true,
      data: dialogData
    });
    this.manageRequestDialogRef.afterClosed().subscribe({
      next: (data: any) => {
        if (data) {
          this.manageEnrollRequest(index, request, dialogData)
        }
      }
    });
  }

  manageEnrollRequest(index: number, request: any, dialogData: any) {
    this.apiService.put(apiConstants.manageEnrollmentRequest
      .replace(':id', this.selectedCourseId)
      .replace(':enrollmentId', request._id),
      { isEnrolled: dialogData.action.toLowerCase() == 'accept' }).subscribe({
        next: (data: any) => {
          // if (data.statusCode === 201 || data.statusCode === 200) {
          // this.dataSource.data[index].isEnrolled = data.enrollment.isEnrolled;
          // this.dataSource = new MatTableDataSource<any>(this.dataSource.data);
          this.getEnrollmentRequests()
          this.alertService.notify(data.message);
          // } else {
          //   this.errorHandlingService.handle(data);
          // }
        },
        error: (e) => this.errorHandlingService.handle(e),
      });
  }


}
