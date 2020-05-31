import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from './http-client.service';
import { GlobalService } from './global.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LookupsService } from './lookups.service';

@Injectable()
export class BackendAPIService {
  onAuthenticationChanged: BehaviorSubject<any> = new BehaviorSubject(
    undefined
  );
  constructor(
    private httpClientService: HttpClientService,
    private globalService: GlobalService,
    private lookupsService: LookupsService
  ) {}

  login(username, password): Promise<any> {
    var headers = new HttpHeaders();
    headers = headers.append(
      'Authorization',
      'Basic ' + window.btoa(username + ':' + password)
    );
    return new Promise((resolve, reject) => {
      this.httpClientService
        .post('login', null, headers)
        .subscribe((response: any) => {
          // response.profile.userInfo = null;
          this.globalService.setAuthInfo(response);
          resolve(response);
        }, reject);
    });
  }

  calculate(calculateInfo): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClientService
        .post('calculate', calculateInfo)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  updateUserInfo(userInfo): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClientService
        .post('user/updateUserInfo', userInfo)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getUserProfile(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClientService
        .post('user/getUserProfile', null)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getRankings(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClientService
        .post('rankings/get', null)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getNotifications(criteriaFilter): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClientService
        .post('notifications/get', criteriaFilter)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  readNotification(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClientService
        .post('notification/read', { id: id })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  deleteNotification(type, id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClientService
        .post('notifications/delete', { notificationsType: type, id: id })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  sendNotification(notification): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClientService
        .post('notification/send', notification)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getNewsFeeds(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClientService
        .post('newsfeed/get', null)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}
