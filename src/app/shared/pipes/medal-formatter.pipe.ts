import { Pipe, PipeTransform } from '@angular/core';
import { MEDALS_DICT } from '../models/medals';
@Pipe({
  name: 'medalFormatter',
  pure: false
})
export class MedalPipe implements PipeTransform {
  transform(medalId: number, useSmall: boolean, isDisabled: boolean): any {
    if (medalId == undefined) {
      return null;
    }
    let medal = MEDALS_DICT[medalId];
    var url = null;
    if (useSmall) {
      if (isDisabled) {
        url =
          'assets/images/medals/' +
          medal.disabledMediumIcon +
          '.png';
      } else {
        url =
          'assets/images/medals/' +
          medal.normalMediumIcon +
          '.png';
      }
    } else {
      if (isDisabled) {
        url =
          'assets/images/medals/' +
          medal.disabledLargeIcon +
          '.png';
      } else {
        url =
          'assets/images/medals/' +
          medal.normalLargeIcon +
          '.png';
      }
    }
    return url;
  }
}
