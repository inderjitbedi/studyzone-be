import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';
import { CouponFormComponent } from '../coupon-form/coupon-form.component';
import { ConfirmDialogComponent } from 'src/app/views/common/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss'],
})
export class CouponComponent implements OnInit {
  addCouponDialogRef: any;
  displayedColumns: string[];
  dataSource: any;
  apiCallActive: boolean = true;
  constructor(
    private apiService: CommonAPIService,
    public dialog: MatDialog,
    private errorHandlingService: ErrorHandlingService,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute,
    public router: Router,
    private _location: Location
  ) {
    this.displayedColumns = [
      'id',
      'name',
      'coursename',
      'value',
      'usageLimit',
      'status',
      'actions',
    ];
    this.activeRoute.params.subscribe({
      next: ({ type }) => {
        this.currentUrl = this.router.url;
        this.getCoupons(type);
      },
    });
    this.navLinks = [
      // {
      //   label: 'Public',
      //   link: '/dashboard/payment/coupon/public',
      //   index: 0,
      // },
      // {
      //   label: 'Private',
      //   link: '/dashboard/payment/coupon/private',
      //   index: 1,
      // },
      {
        label: 'Paid',
        link: '/dashboard/payment/coupon/paid',
        index: 2,
      },
    ];
  }
  currentUrl: any = '';
  updateUrl(navLink: any) {
    this._location.go(navLink.link);
    this.currentUrl = navLink.link;
    this.getCoupons(navLink.label.toLowerCase());
  }
  navLinks: any[];
  activeLinkIndex = -1;
  ngOnInit(): void {
    // this.openAddCouponForm(false);
    // for reloading current page
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  delete(index: number, course: any) {
    this.openConfirmDialog(index, course, {
      course,
      heading: 'Delete coupon',
      type: 'delete',
      message: 'Are you sure you want to delete this coupon?',
    });
  }

  addCourseDialogRef: any;
  openConfirmDialog(index: number, course: any, dialogData: any = {}): void {
    this.addCourseDialogRef = this.dialog.open(ConfirmDialogComponent, {
      minWidth: '320px',
      width: '585px',
      disableClose: true,
      data: dialogData,
    });
    this.addCourseDialogRef.afterClosed().subscribe({
      next: (data: any) => {
        if (data) {
          if (dialogData.type == 'delete') {
            this.deleteCourse(index, course);
          } //else this.manageCourse(index, course);
        }
      },
    });
  }

  deleteCourse(index: number, course: any) {
    this.apiService
      .put(apiConstants.deleteCoupon.replace(':id', course._id), {
        isDeleted: true,
      })
      .subscribe({
        next: (data) => {
          // if (data.statusCode === 201 || data.statusCode === 200) {
          this.coupons.splice(index, 1);
          this.dataSource = new MatTableDataSource<any>(this.coupons || []);
          // this.dataSource = new MatTableDataSource<any>(
          //   this.dataSource.data || []
          // );
          this.alertService.notify(data.message);
          // } else {
          //   this.errorHandlingService.handle(data);
          // }
        },
        error: (e) => this.errorHandlingService.handle(e),
      });
  }
  coupons: any = [];
  getCoupons(couponType: string = 'paid') {
    this.apiCallActive = true;
    this.apiService
      .get(apiConstants.coupon.replace(':type', couponType))
      .subscribe({
        next: (data) => {
          this.apiCallActive = false;
          // if (data.statusCode === 200) {
          this.coupons = data.coupons || [];
          this.dataSource = new MatTableDataSource<any>(data.coupons || []);
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
  openAddCouponForm(isViewOnly: boolean, coupon: any = {}): void {
    this.addCouponDialogRef = this.dialog.open(CouponFormComponent, {
      minWidth: '520px',
      width: '585px',
      disableClose: true,
      data: { isViewOnly, ...coupon },
    });
    this.addCouponDialogRef.afterClosed().subscribe({
      next: (data: any) => {
        if (data) {
          this.router.navigate(
            [
              '/dashboard/payment/promo-codes/list/' +
                (data?.coupon?.type || 'paid'),
            ],
            { skipLocationChange: true }
          );
        }
      },
    });
  }
}
