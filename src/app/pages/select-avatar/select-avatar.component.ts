import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GlobalService } from '../../shared/services/global.service';
import { AVATARS } from '../../shared/models/avatars';

@Component({
  selector: 'app-select-avatar',
  templateUrl: './select-avatar.component.html',
  styleUrls: ['./select-avatar.component.scss']
})
export class SelectAvatarComponent implements OnInit {
  constructor(
    private _location: Location,
    private globalService: GlobalService
  ) {}
  useCustomHeader: boolean = true;
  title = 'Interswitch Staff';
  canBack = true;
  avatars: any[] = AVATARS;
  selectedavatarId: number = 0;
  selectedSlideIndex: number = 0;
  ngOnInit() {
    if (
      this.globalService.tempUserProfile &&
      this.globalService.tempUserProfile.userInfo &&
      this.globalService.tempUserProfile.userInfo.avatarId != null
    ) {
      this.selectedavatarId = this.globalService.tempUserProfile.userInfo.avatarId;
      var index = this.avatars
        .map(function(e) {
          return e.id;
        })
        .indexOf(this.selectedavatarId);
      this.selectedSlideIndex = this.floor(index / 12);
    }
  }
  floor(value) {
    return Math.floor(value);
  }
  selectAvatar(avatar) {
    this.selectedavatarId = avatar.id;
  }
  setCurrentSlide(index) {
    this.selectedSlideIndex = index;
  }
  parseInt(value) {
    return parseInt(value);
  }
  updateAvatar() {
    this.globalService.tempUserProfile.userInfo.avatarId = this.selectedavatarId;
    this._location.back();
  }
}
