import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'formatdate',
  standalone: true
})
export class FormatdatePipe implements PipeTransform {

  transform(date: string, format: string = 'MMM D, YYYY'): string {
    return moment(date).format(format);
  }

}
