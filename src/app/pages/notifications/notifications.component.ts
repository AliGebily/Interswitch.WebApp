import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener
} from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '../../shared/services/modal.service';
import { BackendAPIService } from '../../shared/services/backend-api.service';
import { environment } from '../../../environments/environment';
import { MEDALS_DICT } from '../../shared/models/medals';
import { GlobalService } from '../../shared/services/global.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  @ViewChild('inboxTabButton') inboxTabButton;
  @ViewChild('inboxSentTabContent') inboxSentTabContent;
  @ViewChild('notificationDetailsModal') notificationDetailsModal;

  title = 'Notifications';
  criteriaFilter = {
    notificationsType: 'INBOX',
    offset: 0,
    limit: environment.DEFUALT_LIMIT
  };
  selectedTabButton: any = null;
  selectedTabContent: any = null;
  activeClass = 'active';
  metadata: any = {};
  newsFeeds: any = {};
  notifications: any = [];
  selectedItem: null;
  medalsDict = MEDALS_DICT;
  constructor(
    private modalService: ModalService,
    private backendAPIService: BackendAPIService,
    private globalService: GlobalService,
    private router: Router
  ) {}
  ngOnInit() {
    this.selectedTabButton = this.inboxTabButton.nativeElement;
    this.selectedTabContent = this.inboxSentTabContent.nativeElement;
    this.LoadNotifications();
  }
  refreshHandler() {
    if (
      this.criteriaFilter.notificationsType == 'INBOX' ||
      this.criteriaFilter.notificationsType == 'SENT'
    ) {
      this.criteriaFilter.offset = 0;
      this.LoadNotifications(true);
    } else {
      this.LoadNewsFeeds();
    }
  }
  LoadNotifications(clear: Boolean = false) {
    this.backendAPIService
      .getNotifications({
        notificationsType: this.criteriaFilter.notificationsType,
        offset: this.criteriaFilter.offset,
        limit: this.criteriaFilter.limit
      })
      .then(response => {
        if (clear) {
          this.notifications = [];
        }
        response.notifications.forEach(notification => {
          this.notifications.push(notification);
        });
        this.metadata = response.metadata;
      });
  }

  LoadNewsFeeds() {
    this.backendAPIService.getNewsFeeds().then(response => {
      this.newsFeeds = response;
    });
  }

  showTab(tabButton: any, tabContent, tabKey) {
    if (this.selectedTabButton.classList.contains(this.activeClass)) {
      this.selectedTabButton.classList.remove(this.activeClass);
    }
    this.selectedTabContent.style.display = 'none';

    if (!tabButton.classList.contains(this.activeClass)) {
      tabButton.classList.add(this.activeClass);
    }
    tabContent.style.display = 'block';

    this.selectedTabButton = tabButton;
    this.selectedTabContent = tabContent;
    this.criteriaFilter.notificationsType = tabKey;
    this.criteriaFilter.offset = 0;
    if (this.criteriaFilter.notificationsType) {
      this.metadata = {};
      this.notifications = [];
      this.LoadNotifications();
    } else {
      this.newsFeeds = {};
      this.LoadNewsFeeds();
    }
  }

  showNotificationModal(elementRef: ElementRef) {
    this.modalService.open(elementRef);
  }
  closeModal(elementRef: ElementRef) {
    this.modalService.close();
  }
  openSendNotification() {
    this.router.navigate(['send-notification']);
  }
  selectedNotification = null;
  selectNotification(notification) {
    this.notifications.forEach(notification => {
      notification.selected = false;
    });
    this.selectedNotification = notification;
    this.selectedNotification.selected = true;
    if (notification.status == 'NEW') {
      this.backendAPIService
        .readNotification(notification.id)
        .then(response => {
          notification.status = 'READ';
          this.showNotificationModal(
            this.notificationDetailsModal.nativeElement
          );
        });
    } else {
      this.showNotificationModal(this.notificationDetailsModal.nativeElement);
    }
  }
  deleteInboxSentNotification(notification) {
    this.backendAPIService
      .deleteNotification(
        this.criteriaFilter.notificationsType,
        notification.id
      )
      .then(response => {
        this.LoadNotifications(true);
        this.modalService.close();
        this.selectedNotification = null;
      });
  }
  viewProfile(profile) {
    this.globalService.tempUserProfile = profile;
    this.router.navigate(['view-profile']);
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      if (
        this.criteriaFilter.notificationsType &&
        this.metadata.totalCount >
          this.criteriaFilter.offset + this.criteriaFilter.limit
      ) {
        this.criteriaFilter.offset += this.criteriaFilter.limit;
        this.LoadNotifications();
      }
    }
  }
}
