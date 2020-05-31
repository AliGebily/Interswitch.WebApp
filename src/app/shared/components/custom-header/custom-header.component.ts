import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss']
})
export class CustomHeaderComponent implements OnInit {
  constructor(
    private _location: Location,
    private router: Router,
    private globalService: GlobalService
  ) {}
  @Input('title') title: string;
  @Input('canBack') canBack: boolean;
  ngOnInit() {}
  goBack() {
    this._location.back();
  }
}
