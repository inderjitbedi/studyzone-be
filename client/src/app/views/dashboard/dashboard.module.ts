import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { MaterialModule } from 'src/app/material/material.module';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/providers/auth.guard';

const routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'user',
        loadChildren: () =>
          import('../../views/dashboard/user/user.module').then((m) => m.UserModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'course',
        loadChildren: () =>
          import('../../views/dashboard/course/course.module').then((m) => m.CourseModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'progress',
        loadChildren: () =>
          import('../../views/dashboard/progress/progress.module').then((m) => m.ProgressModule),
        canActivate: [AuthGuard],
      },
      
      { path: '**', redirectTo: 'user' },

    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [RouterModule.forChild(routes), CommonModule, MaterialModule],
})
export class DashboardModule { }
