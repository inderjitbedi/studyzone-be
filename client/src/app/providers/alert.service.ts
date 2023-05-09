import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AlertDialogComponent } from '../views/common/alert-dialog/alert-dialog.component';

@Injectable()
export class AlertService {
  private alertRef!: MatDialogRef<AlertDialogComponent>;

  closeName = 'End Now';
  config: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  };
  constructor(private snackbar: MatSnackBar, private dialog: MatDialog) {}

  notify(
    message: string,
    type: string = 'success'
    // , buttonName = this.closeName,
    // config = this.config
  ): void {
    // this.snackbar.open(message, buttonName, config);
    this.showAlert(message, type);
  }

  showAlert(message: string = '', type: string = 'success') {
    this.alertRef = this.dialog.open(AlertDialogComponent, {
      minWidth: '261px',
      width: '437px',
      disableClose: true,
      data: {
        message,
        closeText: 'Thanks',
        type,
        autoClose: 3000,
      },
    });
  }

  hideAlert() {
    this.alertRef.close();
  }
}
