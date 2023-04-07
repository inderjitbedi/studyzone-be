import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'initials'})
export class InitialsPipe implements PipeTransform {
  transform(value: string): string {
    const nameArr = value.split(' ');
    const firstNameInitial = nameArr[0].charAt(0).toUpperCase();
    const lastNameInitial = nameArr[nameArr.length - 1].charAt(0).toUpperCase();
    return `${firstNameInitial}${lastNameInitial}`;
  }
}