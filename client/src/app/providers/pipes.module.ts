import { NgModule } from '@angular/core';
import { InitialsPipe } from './initials.pipe';
import { StripeStatusPipe } from './stripeStatus.pipe';

@NgModule({
  declarations: [InitialsPipe, StripeStatusPipe],
  exports: [InitialsPipe, StripeStatusPipe],
})
export class PipesModule {}
