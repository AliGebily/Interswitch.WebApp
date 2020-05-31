import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '../../shared/services/modal.service';
import { BackendAPIService } from '../../shared/services/backend-api.service';
import { environment } from '../../../environments/environment.prod';
import { GlobalService } from '../../shared/services/global.service';
import { JsonpCallbackContext } from '@angular/common/http/src/jsonp';
import { Location } from '@angular/common';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {
  useCustomHeader = true;
  title;
  canBack = true;
  btnUpdateText;

  userProfile: any;
  constructor(
    public router: Router,
    private modalService: ModalService,
    public backendAPIService: BackendAPIService,
    public globalService: GlobalService
  ) {
    if (this.globalService.tempUserProfile == null) {
      this.userProfile = JSON.parse(
        JSON.stringify(this.globalService.getAuthInfo().profile)
      );
      this.userProfile.userInfo = this.userProfile.userInfo || {};
    } else {
      this.userProfile = this.globalService.tempUserProfile;
      this.globalService.tempUserProfile = null;
    }
    this.setTexts();
  }
  setTexts() {
    // this.title = this.userProfile.userInfo ? 'Update Profile' : 'Sign up';
    // this.btnUpdateText = this.userProfile.userInfo ? 'UPDATE' : 'REGISTER';
    this.title = 'Profile';
    this.btnUpdateText = 'UPDATE';
  }
  ngOnInit() {}

  isConnecting: Boolean = false;
  updateProfile() {
    if (this.isConnecting) {
      return;
    }
    this.isConnecting = true;
    this.backendAPIService
      .updateUserInfo(this.userProfile.userInfo)
      .then(userProfile => {
        this.isConnecting = false;
        var authInfo = this.globalService.getAuthInfo();
        authInfo.profile = userProfile;
        this.globalService.setAuthInfo(authInfo);
        this.router.navigate([environment.HOME_URL]);
      })
      .catch(error => {
        this.isConnecting = false;
      });
  }
  logout() {
    this.globalService.logout();
  }
  selectAvatar() {
    this.globalService.tempUserProfile = this.userProfile;
    this.router.navigate(['select-avatar']);
  }
  openModal(elementRef: ElementRef) {
    this.modalService.open(elementRef);
  }
  closeModal(elementRef: ElementRef) {
    this.modalService.close();
  }
}
