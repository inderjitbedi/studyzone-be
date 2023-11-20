import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProgressByCoursesComponent } from './user-progress-by-courses/user-progress-by-courses.component';
import { MaterialModule } from 'src/app/material/material.module';
import { RouterModule } from '@angular/router';

const routes = [
  { path: 'course/:type', component: UserProgressByCoursesComponent },
  { path: '**', redirectTo: 'user-progress/public' },
];

@NgModule({
  declarations: [UserProgressByCoursesComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MaterialModule],
})
export class ProgressModule {}
