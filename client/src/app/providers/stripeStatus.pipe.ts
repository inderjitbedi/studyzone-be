import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'stripestatus' })
export class StripeStatusPipe implements PipeTransform {
  transform(value: string): string {
    // Remove underscores and title case the string
    return value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
  }
}
