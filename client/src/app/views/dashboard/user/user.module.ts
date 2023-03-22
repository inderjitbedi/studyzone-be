import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { RouterModule } from '@angular/router';
import { LoaderModule } from '../../common/loader/loader.module';
import { MaterialModule } from 'src/app/material/material.module';
import { InviteUserFormComponent } from './invite-user-form/invite-user-form.component';

const routes = [
  { path: 'list', component: UserListComponent },
  { path: '**', redirectTo: 'list' },
];


@NgModule({
  declarations: [
    UserListComponent,
    UserFormComponent,
    InviteUserFormComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,MaterialModule, LoaderModule
  ]
})
export class UserModule { }
