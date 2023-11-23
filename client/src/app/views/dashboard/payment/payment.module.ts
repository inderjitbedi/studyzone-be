import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { CouponComponent } from './coupon/coupon.component';
import { MaterialModule } from 'src/app/material/material.module';
import { CouponFormComponent } from './coupon-form/coupon-form.component';
import { RouterModule } from '@angular/router';
import { StripeStatusPipe } from 'src/app/providers/stripeStatus.pipe';
import { PipesModule } from 'src/app/providers/pipes.module';

const routes = [
  { path: 'promo-codes', component: CouponComponent },
  { path: 'transaction-history', component: PaymentHistoryComponent },
  { path: '**', redirectTo: 'promo-codes' },
];

@NgModule({
  declarations: [PaymentHistoryComponent, CouponComponent, CouponFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    PipesModule,
  ],
})
export class PaymentModule {}
