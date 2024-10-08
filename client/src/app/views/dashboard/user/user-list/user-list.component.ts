import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { ConfirmDialogComponent } from 'src/app/views/common/confirm-dialog/confirm-dialog.component';
import { InviteUserFormComponent } from '../invite-user-form/invite-user-form.component';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  addUserDialogRef: any;
  displayedColumns: string[];
  dataSource: any;
  users: any = [];
  apiCallActive: boolean = true;
  selectedUserCategory: any;
  constructor(
    private apiService: CommonAPIService,
    public dialog: MatDialog,
    private errorHandlingService: ErrorHandlingService,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute
  ) {
    this.displayedColumns = ['id', 'fullName', 'email', 'isSignedUp', 'action'];

    this.activeRoute.params.subscribe({
      next: (route) => {
        this.getUsers();
      },
    });
  }
  ngOnInit(): void {}
  openConfirmDialog(index: number, user: any, actionData: any): void {
    this.addUserDialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '320px',
      width: '585px',
      disableClose: true,
      data: {
        actionData,
        user,
        heading:
          (actionData.isActive != undefined || actionData.isActive != null
            ? user.isActive
              ? 'Deactivate'
              : 'Activate'
            : actionData.isVerified != undefined ||
              actionData.isVerified != null
            ? 'Verify'
            : 'Delete') + ' User',
        message:
          'Are you sure you want to ' +
          (actionData.isActive != undefined || actionData.isActive != null
            ? user.isActive
              ? 'deactivate'
              : 'activate'
            : actionData.isVerified != undefined ||
              actionData.isVerified != null
            ? 'verify'
            : 'delete') +
          ' this user?',
      },
    });
    this.addUserDialogRef.afterClosed().subscribe({
      next: (data: any) => {
        if (data) {
          this.manageUser(index, user, actionData);
        }
      },
    });
  }

  openUserInviteForm(isViewOnly: boolean, user: any = {}): void {
    this.addUserDialogRef = this.dialog.open(InviteUserFormComponent, {
      minWidth: '320px',
      width: '585px',
      disableClose: true,
      data: { isViewOnly, user },
    });
    this.addUserDialogRef.afterClosed().subscribe({
      next: (data: any) => {
        if (data) {
          this.getUsers();
        }
      },
    });
  }
  selectedUserCategoryDoc: any;
  getUsers() {
    this.apiCallActive = true;
    this.apiService.get(apiConstants.user).subscribe({
      next: (data) => {
        this.apiCallActive = false;
        // if (data.statusCode === 200) {
        this.users = data.users || [];
        // this.dataSource = new MatTableDataSource<any>(data.users || []);
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
  manageUser(index: number, user: any, actionData: any) {
    console.log('manageUserAccess = ', actionData);
    this.apiService
      .put(apiConstants.manageUserAccess, {
        email: user.email,
        ...actionData,
      })
      .subscribe({
        next: (data) => {
          // if (data.statusCode === 201 || data.statusCode === 200) {

          if (actionData.isDeleted) {
            this.users.splice(index, 1);
          } else {
            const isActive = this.users[index].isActive;
            this.users[index].isActive = !isActive;
          }
          this.alertService.notify(data.message);
          // } else {
          //   this.errorHandlingService.handle(data);
          // }
        },
        error: (e) => this.errorHandlingService.handle(e),
      });
  }
}
