import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './routing/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from './providers/auth.guard';
import { CommonAPIService } from './providers/api.service';
import { AlertService } from './providers/alert.service';
import { GetSetService } from './providers/getSet.provider';
import { LoaderInterceptor } from './providers/loader.interceptor';
import { AuthInterceptor } from './providers/auth.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { LoaderService } from './providers/loader.service';
import { LoaderModule } from './views/common/loader/loader.module';
import { ConfirmDialogComponent } from './views/common/confirm-dialog/confirm-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { InitialsPipe } from './providers/initials.pipe';
import { AlertDialogComponent } from './views/common/alert-dialog/alert-dialog.component';

@NgModule({
  declarations: [AppComponent, ConfirmDialogComponent, AlertDialogComponent],
  imports: [
    MaterialModule,
    AppRoutingModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LoaderModule,
    DragDropModule,
  ],
  providers: [
    CommonAPIService,
    AuthGuard,
    AlertService,
    GetSetService,
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  // exports: [InitialsPipe]
})
export class AppModule {}
