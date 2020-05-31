import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
  NavigationStart,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { HttpClientService } from './http-client.service';
import { Subject } from 'rxjs/Subject';

import { UpdateProfileComponent } from '../../pages/update-profile/update-profile.component';

const storageAuthInfoKey = 'interswitch_webapp_auth_info';

@Injectable()
export class GlobalService {
  private _authInfo = null;

  onAuthenticationInfoChanged: BehaviorSubject<any> = new BehaviorSubject(
    undefined
  );
  onLoginScreen: BehaviorSubject<boolean> = new BehaviorSubject(false);
  onImagePreview: Subject<any> = new Subject<any>();
  tempUserProfile: any;
  constructor(
    private httpClientService: HttpClientService,
    private router: Router
  ) {
    this.getAuthInfo();
    this.httpClientService.authenticationToken = this.getToken();
    this.onAuthenticationInfoChanged.next(this.getAuthInfo());

    this.httpClientService.onUnAuthenticatedError.subscribe(data => {
      if (data === undefined) return;
      if (this.isLoggedIn()) {
        this.setAuthInfo({});
        this.router.navigate([environment.LOGIN_URL]);
      }
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (
          event.url.indexOf('error-404') == -1 &&
          event.url.indexOf('login') == -1
        ) {
          if (this.isLoggedIn()) {
            if (!this.getAuthInfo().profile.userInfo) {
              if (
                event.url.indexOf('update-profile') == -1 &&
                event.url.indexOf('select-avatar') == -1
              ) {
                this.tempUserProfile = null;
                this.router.navigate(['update-profile']);
              }
            }
            // else{}//continue
          } else {
            this.router.navigate([environment.LOGIN_URL]);
          }
        }
      }
    });
  }

  isLoggedIn(): boolean {
    return this.getToken() != null;
  }

  getToken() {
    return this._authInfo != null ? this._authInfo.token : null;
  }
  getAuthInfo(): any {
    if (!this._authInfo) {
      let authInfo: any;
      try {
        authInfo = JSON.parse(localStorage.getItem(storageAuthInfoKey));
        if (!authInfo) {
          authInfo = {};
        }
      } catch (error) {
        authInfo = {};
      }
      this._authInfo = authInfo;
    }
    return this._authInfo;
  }

  setAuthInfo(authInfo) {
    localStorage.removeItem(storageAuthInfoKey);
    localStorage.setItem(storageAuthInfoKey, JSON.stringify(authInfo));
    this._authInfo = authInfo;

    this.httpClientService.authenticationToken = this.getToken();

    this.onAuthenticationInfoChanged.next(this.getAuthInfo());
  }
  logout(): void {
    this.httpClientService
      .post('logout', null)
      .subscribe((response: Response) => {});
    this.setAuthInfo({});
    this.router.navigate([environment.LOGIN_URL]);
  }
}
