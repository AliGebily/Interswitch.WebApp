import { Pipe, PipeTransform } from '@angular/core';
import { AVATARS_DICT } from '../models/avatars';
@Pipe({
  name: 'avatarFormatter',
  pure: false
})
export class AvatarPipe implements PipeTransform {
  transform(
    avatarId: number,
    useSmallMask: boolean
  ): any {
    if (avatarId == undefined) {
      avatarId = 3;
    }
    let avatar = AVATARS_DICT[avatarId];
    if (!avatar) {
      console.error('No avatar found with id=' + avatarId);
      return null;
    }
    var url = null;
    if (useSmallMask) {
      url = 'assets/images/avatars/small/' + avatar.smallIcon + '.png';
    } else {
      url = 'assets/images/avatars/large/' + avatar.largeIcon + '.png';
    }
    return url;
  }
}
