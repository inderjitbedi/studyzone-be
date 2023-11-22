import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/providers/alert.service';
import { apiConstants } from 'src/app/providers/api.constants';
import { CommonAPIService } from 'src/app/providers/api.service';
import { ErrorHandlingService } from 'src/app/providers/error-handling.service';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss'],
})
export class PaymentHistoryComponent implements OnInit {
  displayedColumns: string[];
  transactions: any = [];
  apiCallActive: boolean = true;
  constructor(
    private apiService: CommonAPIService,
    private errorHandlingService: ErrorHandlingService,
    private alertService: AlertService,
    private activeRoute: ActivatedRoute,
    public router: Router
  ) {
    this.displayedColumns = [
      'id',
      'coursename',
      'coupon',
      'amount',
      'email',
      'createdAt',
      'status',
    ];
    this.getTransactions();
  }
  pagination: any = {
    page: 1,
    limit: 10,
    total: 0,
  };
  dataSource: any;

  ngOnInit(): void {}

  toQueryString(obj: any) {
    let queryStr = '';
    Object.keys(obj).map((key: any, index: number) => {
      if (obj[key]) {
        index === 0 ? (queryStr += '?') : (queryStr += '&');

        queryStr += key + '=' + obj[key];
      }
    });
    return queryStr;
  }
  onPageChange(event: any) {
    console.log(event);

    this.pagination.page = event.pageIndex + 1;
    this.pagination.limit = event.pageSize;
    this.getTransactions();
  }
  getTransactions() {
    this.apiCallActive = true;
    let { page, limit } = this.pagination;
    this.apiService
      .get(apiConstants.getTransaction + this.toQueryString({ page, limit }))
      .subscribe({
        next: (data) => {
          this.apiCallActive = false;
          // if (data.statusCode === 200) {
          this.transactions = data.transactions || [];
          this.pagination.total = data.totalTransactions;
          this.pagination.page = data.page;
          this.dataSource = new MatTableDataSource<any>(
            data.transactions || []
          );

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
}
