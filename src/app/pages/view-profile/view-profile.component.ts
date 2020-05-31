import { Component, OnInit, ElementRef } from '@angular/core';
import { GlobalService } from '../../shared/services/global.service';
import { Router } from '@angular/router';
import { stringify } from '@angular/compiler/src/util';
import { MEDALS, MEDALS_DICT } from '../../shared/models/medals';
import { ModalService } from '../../shared/services/modal.service';
import { BackendAPIService } from '../../shared/services/backend-api.service';
@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
  title = 'Profile';
  medals: any[] = [];
  userProfile: any;
  currentMedal: any = null;
  constructor(
    private modalService: ModalService,
    public globalService: GlobalService,
    private backendAPIService: BackendAPIService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.globalService.tempUserProfile) {
      this.userProfile = this.globalService.tempUserProfile;
      this.globalService.tempUserProfile = null;
    } else {
      this.userProfile = this.globalService.getAuthInfo().profile;
    }
    this.fillMedals();
  }
  fillMedals() {
    this.medals = [];
    this.userProfile.userData.medals.forEach(userMedal => {
      let mainMedal = JSON.parse(JSON.stringify(MEDALS_DICT[userMedal.id]));
      if (userMedal.id == 8 || userMedal.id == 20) {
        // Exceptional or RUN_OR_ELSE
        mainMedal.description = userMedal.description || mainMedal.description;
      } else {
        mainMedal.description = mainMedal.description;
      }
      this.medals.push(mainMedal);
    });
  }
  refreshHandler() {
    this.backendAPIService.getUserProfile().then(profile => {
      var authInfo = this.globalService.getAuthInfo();
      authInfo.profile = profile;
      this.globalService.setAuthInfo(authInfo);
      this.userProfile = authInfo.profile;
      this.fillMedals();
    });
  }
  updateProfile() {
    if (this.userProfile.id == this.globalService.getAuthInfo().profile.id) {
      this.router.navigate(['update-profile']);
    }
  }

  openMedalDetails(medal: any, elementRef: ElementRef) {
    this.currentMedal = medal;
    this.modalService.open(elementRef);
  }
  closeModal(elementRef: ElementRef) {
    this.currentMedal = null;
    this.modalService.close();
  }
}
