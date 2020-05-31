import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../../shared/services/global.service';
import { BackendAPIService } from '../../shared/services/backend-api.service';
@Component({
  selector: 'app-send-notification',
  templateUrl: './send-notification.component.html',
  styleUrls: ['./send-notification.component.scss']
})
export class SendNotificationComponent implements OnInit {
  title = 'Notification';
  selectedFilter;
  body;
  notificationsFilters;
  constructor(
    private router: Router,
    private globalService: GlobalService,
    private backendAPIService: BackendAPIService
  ) {}

  ngOnInit() {
    this.notificationsFilters = this.globalService.getAuthInfo().notificationsFilters;
  }
  toggleSelect(dropdownContent, downArrow, upArrow, selectedFilter) {
    if (window.getComputedStyle(dropdownContent).display == 'none') {
      dropdownContent.style.display = 'block';
      downArrow.style.display = 'none';
      upArrow.style.display = 'inline';
    } else {
      dropdownContent.style.display = 'none';
      downArrow.style.display = 'inline';
      upArrow.style.display = 'none';
    }

    this.selectedFilter = selectedFilter;
  }
  isConnecting: Boolean = false;
  sendNotification() {
    if (this.isConnecting) {
      return;
    }
    this.isConnecting = true;
    this.backendAPIService
      .sendNotification({
        body: this.body,
        filterID: this.selectedFilter.filterID,
        filterValue: this.selectedFilter.filterName
      })
      .then(() => {
        this.isConnecting = true;
        this.router.navigate(['notifications']);
      })
      .catch(error => {
        this.isConnecting = false;
      });
  }
}
