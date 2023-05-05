import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent implements OnInit {
  public dialogData: any = {}
  constructor(public matDialog: MatDialogRef<AlertDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dialogData = data;
    if (data.autoClose) {
      setTimeout(() => {
        this.matDialog.close()
      }, data.autoClose);
    }
  }
  ngOnInit(): void {
  }

}
