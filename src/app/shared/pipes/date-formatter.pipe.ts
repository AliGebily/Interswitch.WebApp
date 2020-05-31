import { Pipe, PipeTransform } from '@angular/core';
import { weekdays } from '../models/weekdays';

@Pipe({
  name: 'dateFormatter',
  pure: false
})
export class DateFormatterPipe implements PipeTransform {
  //format:   2018-10-29 11:17:09 AM
  transform(dateValue: string): any {
    var dateTime =
      dateValue && dateValue.length > 0 ? dateValue.split(' ') : [];

    if (dateTime.length > 2) {
      var date = dateTime[0].split('-');
      var dateObj = new Date(
        parseInt(date[0]),
        parseInt(date[1]) - 1,
        parseInt(date[2])
      );
      var today = new Date();
      var todayBeforeWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 6
      );
      if (
        today.getFullYear() == dateObj.getFullYear() &&
        today.getMonth() == dateObj.getMonth() &&
        today.getDate() == dateObj.getDate()
      ) {
        // today
        return dateTime[1].substring(0, 5) + ' ' + dateTime[2];
      } else if (dateObj < today && dateObj >= todayBeforeWeek) {
        // toweek
        return (
          weekdays[dateObj.getDay()] +
          ' ' +
          dateTime[1].substring(0, 5) +
          ' ' +
          dateTime[2]
        );
      } else {
        return dateTime[0];
      }
    } else {
      return dateTime[0];
    }
  }
}
