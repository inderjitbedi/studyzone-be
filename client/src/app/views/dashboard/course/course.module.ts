import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { LoaderModule } from '../../common/loader/loader.module';
import { CourseFormComponent } from './course-form/course-form.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { SlideFormComponent } from './slide/slide-form/slide-form.component';
import { SlideListComponent } from './slide/slide-list/slide-list.component';
import { InitialsPipe } from 'src/app/providers/initials.pipe';
import { CommentComponent } from './comment/comment.component';
import { ManageEnrollmentComponent } from './manage-enrollment/manage-enrollment.component';
import { NewEnrollmentComponent } from './new-enrollment/new-enrollment.component';
import { ManageEnrollmentRequestsComponent } from './manage-enrollment-requests/manage-enrollment-requests.component';

const routes = [
  { path: 'list/:type', component: CourseListComponent },
  // { path: 'list/:type/slide/list', component: CourseListComponent },
  { path: 'details/:id', component: CourseDetailsComponent },
  { path: '**', redirectTo: 'list' },
];


@NgModule({
  declarations: [
    CourseListComponent,
    CourseDetailsComponent,
    CourseFormComponent,
    SlideFormComponent,
    SlideListComponent,
    InitialsPipe,
    CommentComponent,
    ManageEnrollmentComponent,
    NewEnrollmentComponent,
    ManageEnrollmentRequestsComponent

  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule, MaterialModule, LoaderModule,DragDropModule
  ]
})
export class CourseModule { }
