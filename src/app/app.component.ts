import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { ModalService } from './shared/services/modal.service';
import { GlobalService } from './shared/services/global.service';
import { routerAnimation } from './animations';
import { debug } from 'util';
import { SplashScreenService } from './shared/services/splash-screen.service';
import { HttpClientService } from './shared/services/http-client.service';
import { BackendAPIService } from './shared/services/backend-api.service';

@Component({
  selector: 'app-root',
  animations: [routerAnimation],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('notificationDetailsModal') notificationDetailsModal;
  @ViewChild('errorModal') errorModal;

  title: string;
  useCustomHeader: boolean;
  canBack: boolean;
  errorMessage: string;
  isConnectingToServer: boolean = false;
  isConnectingToServerTimeoutHandler = null;

  constructor(
    private router: Router,
    private modalService: ModalService,
    private globalService: GlobalService,
    private splashScreenService: SplashScreenService,
    private httpClientService: HttpClientService,
    private backendAPIService: BackendAPIService
  ) {
    this.globalService.onAuthenticationInfoChanged.subscribe(() => {});
    this.globalService.onLoginScreen.subscribe(isLoginScreen => {});
  }
  ngOnInit() {
    this.httpClientService.onHttpError.subscribe(errorMessage => {
      if (errorMessage === undefined) return;
      this.splashScreenService.hide();
      // onHttpErrorSubscribtion.unsubscribe();
      this.errorMessage = errorMessage;
      this.modalService.open(this.errorModal.nativeElement);
    });

    this.httpClientService.onRequestStarted.subscribe(data => {
      if (data === undefined) return;
      clearTimeout(this.isConnectingToServerTimeoutHandler);
      this.isConnectingToServerTimeoutHandler = setTimeout(() => {
        this.isConnectingToServer = true;
      }, 100);
    });
    this.httpClientService.onAllRequestsFinished.subscribe(data => {
      if (data === undefined) return;
      clearTimeout(this.isConnectingToServerTimeoutHandler);
      this.isConnectingToServerTimeoutHandler = setTimeout(() => {
        this.isConnectingToServer = false;
      }, 0);
    });
    this.splashScreenService.hide();

    this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      this.modalService.close();
      window.scrollTo(0, 0);
    });
    // setTimeout(() => {
    //   this.openNotificationDetails(
    //     {
    //       title: 'Wooho!',
    //       content: `Anu Just completed a payroll deal with the government in Lagos-
    //       Congrats Anu on the great achievement`,
    //       avatarId: 'character_17_small.png'
    //     },
    //     this.notificationDetailsModal.nativeElement
    //   );
    // }, 10000000);
  }
  currentNotification: any = null;
  openNotificationDetails(notification: any, elementRef: ElementRef) {
    this.currentNotification = notification;
    this.modalService.open(elementRef);
  }
  closeModal(elementRef: ElementRef) {
    this.currentNotification = null;
    this.errorMessage = null;
    this.modalService.close();
  }
  // change the animation state
  getRouteAnimation(outlet) {
    return outlet.activatedRouteData.animation;
  }
  currentComponent: any;
  onRouteActivate($event) {
    this.title = $event.title;
    this.useCustomHeader = $event.useCustomHeader;
    this.canBack = $event.canBack;
    this.currentComponent = $event;
  }
  refreshHandler: any;
  refresh() {
    if (this.currentComponent && this.currentComponent.refreshHandler) {
      this.currentComponent.refreshHandler();
    }
  }
}
