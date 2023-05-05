import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
// import { InitialsPipe } from 'src/app/providers/initials.pipe';
import { ConfirmDialogComponent } from 'src/app/views/common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CommentComponent implements OnInit {
  constructor(
    private apiService: CommonAPIService,
    public dialog: MatDialog, private fb: FormBuilder,
    private errorHandlingService: ErrorHandlingService,
    private alertService: AlertService
  ) {
    this.replyForm = this.fb.group({
      comment: ['', [Validators.required]],
    })
  }
  apiCallActive: boolean = false;
  getComments() {
    this.apiCallActive = true;
    this.apiService.get(apiConstants.getComments.replace(':id', this.courseId)).subscribe({
      next: ({ comments }) => {
        this.apiCallActive = false;
        this.comment = comments?.length ? comments[0] : {}
      },
      error: (e) => {
        this.apiCallActive = false;
        this.errorHandlingService.handle(e);
      },
    });
  }
  replyForm: FormGroup;
  ngOnInit(): void {
    console.log(this.comment);
    //     this.courseId.subscribe({next:(data:any)=>{
    // console.log(data);

    //     }})
    this.getComments()

  }

  @Input() comment: any;
  @Input() courseId: any;

  confirmDialogRef: any;
  delete(comment: any) {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '320px',
      width: '585px',
      disableClose: true,
      data: {
        heading: 'Delete slide',
        message: 'Are you sure you want to delete this comment?',
      },
    });
    this.confirmDialogRef.afterClosed().subscribe({
      next: (data: any) => {
        if (data) {
          this.deleteComment(comment._id);
        }
      },
    });
  }

  deleteComment(commentId: any) {
    this.apiService
      .put(
        apiConstants.deleteComment
          .replace(':id', this.courseId)
          .replace(':commentId', commentId),
        { isDeleted: true }
      )
      .subscribe({
        next: (data) => {
          // if (data.statusCode === 201 || data.statusCode === 200) {
          // let rootComments  = this.comment;
          // this.comment.forEach((rootComment: any, index: any) => {
          if (this.comment._id === commentId) {
            this.comment = null;
          } else {
            if (this.comment.children?.length) {
              this.comment.children.forEach((reply: any, i: any) => {
                if (reply._id === commentId) {
                  this.comment.children.splice(i, 1);
                }
              });
            }
          }
          // }); 
          // this.alertService.notify(data.message);
          // } else {
          //   this.errorHandlingService.handle(data);
          // }
        },
        error: (e) => this.errorHandlingService.handle(e),
      });
  }

  addComment(commentId: any) {
    if (this.replyForm.valid)
      this.apiService
        .post(apiConstants.addComment.replace(':id', this.courseId), {
          text: this.replyForm.value.comment,
          parent: commentId,
        })
        .subscribe({
          next: (data) => {
            console.log(data);
            let comment = data.comment;
            comment.author = { _id: comment.author, fullName: 'Admin' }
            this.comment.children.push(comment);
            this.replyForm.controls['comment'].setValue('')
            // if (data.statusCode === 201 || data.statusCode === 200) {

            // this.rootComments.forEach((rootComment: any, index: any) => {
            //   if (rootComment._id === commentId) {
            //     this.rootComments.splice(index, 1);
            //   } else {
            //     if (rootComment.children?.length) {
            //       rootComment.children.forEach((reply: any, i: any) => {
            //         if (reply._id === commentId) {
            //           this.rootComments[index].children.splice(i, 1);
            //         }
            //       });
            //     }
            //   }
            // });
            // this.alertService.notify(data.message);
            // } else {
            //   this.errorHandlingService.handle(data);
            // }
          },
          error: (e) => this.errorHandlingService.handle(e),
        });
  }
}
