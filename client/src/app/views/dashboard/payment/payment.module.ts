import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { CouponComponent } from './coupon/coupon.component';
import { MaterialModule } from 'src/app/material/material.module';
import { CouponFormComponent } from './coupon-form/coupon-form.component';
import { RouterModule } from '@angular/router';

const routes = [
  { path: 'promo-codes/:type', component: CouponComponent },
  { path: 'history', component: PaymentHistoryComponent },
  { path: '**', redirectTo: 'promo-codes/public' },
];

@NgModule({
  declarations: [PaymentHistoryComponent, CouponComponent, CouponFormComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MaterialModule],
})
export class PaymentModule {}
