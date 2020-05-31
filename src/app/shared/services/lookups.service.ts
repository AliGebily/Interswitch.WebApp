import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from './http-client.service';

@Injectable()
export class LookupsService implements Resolve<any> {
  users: any;
  regions: any[];
  teams: any[];
  medals: any[];
  constructor(private httpClientService: HttpClientService) {}

  /**
   * Resolve
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getUsers(),
        this.getRegions(),
        this.getTeams(),
        this.getMedals()
      ]).then(() => {
        resolve();
      }, reject);
    });
  }

  getUsers(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.users != null) {
        resolve(this.users);
      } else {
        this.httpClientService
          .post('rankings/get', null)
          .subscribe((response: any) => {
            this.users = response.rankingResult;
            resolve(response);
          }, reject);
      }
    });
  }

  setRegions(regions) {
    localStorage.setItem('regions', JSON.stringify(regions));
    this.regions = regions;
  }
  getRegions(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.regions == null) {
        var regions: any = localStorage.getItem('regions');
        if (regions == null) {
          regions = [];
        } else {
          this.regions = JSON.parse(regions);
        }
      }
      resolve(this.regions);
    });
  }
  setTeams(teams) {
    localStorage.setItem('teams', JSON.stringify(teams));
    this.teams = teams;
  }
  getTeams(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.teams == null) {
        var teams: any = localStorage.getItem('teams');
        if (teams == null) {
          teams = [];
        } else {
          this.teams = JSON.parse(teams);
        }
      }
      resolve(this.teams);
    });
  }
  getMedals(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.medals != null) {
        resolve(this.medals);
      } else {
        this.httpClientService
          .post('medals/get', null)
          .subscribe((response: any) => {
            this.medals = response;
            resolve(response);
          }, reject);
      }
    });
  }
}
