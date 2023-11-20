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
      'couponname',
      'username',
      'email',
      'enrolledOn',
      'progress',
      'lastActivity',
    ];
    this.activeRoute.params.subscribe({
      next: ({ type }) => {
        this.currentUrl = this.router.url;
        this.getProgress(type);
      },
    });
    this.navLinks = [
      {
        label: 'Public',
        link: '/dashboard/payment/coupon/public',
        index: 0,
      },
      {
        label: 'Private',
        link: '/dashboard/payment/coupon/private',
        index: 1,
      },
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
    this.getProgress(navLink.label.toLowerCase());
  }
  navLinks: any[];
  activeLinkIndex = -1;
  ngOnInit(): void {
    // for reloading current page
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  getProgress(couponType: string = 'public') {
    this.apiCallActive = true;
    this.apiService
      .get(apiConstants.coupon.replace(':type', couponType))
      .subscribe({
        next: (data) => {
          this.apiCallActive = false;
          // if (data.statusCode === 200) {
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
                (data?.coupon?.type || 'public'),
            ],
            { skipLocationChange: true }
          );
        }
      },
    });
  }
}
