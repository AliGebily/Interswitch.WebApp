import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { Error404Component } from './pages/error-404/error-404.component';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';
import { ViewProfileComponent } from './pages/view-profile/view-profile.component';
import { MedalsComponent } from './pages/medals/medals.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { CalculatorComponent } from './pages/calculator/calculator.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { SendNotificationComponent } from './pages/send-notification/send-notification.component';
import { SelectAvatarComponent } from './pages/select-avatar/select-avatar.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { CustomHeaderComponent } from './shared/components/custom-header/custom-header.component';
import { ErrorMessageComponent } from './shared/components/error-message/error-message.component';

import { ModalService } from './shared/services/modal.service';
import { SplashScreenService } from './shared/services/splash-screen.service';
import { HttpClientService } from './shared/services/http-client.service';
import { GlobalService } from './shared/services/global.service';
import { LookupsService } from './shared/services/lookups.service';
import { BackendAPIService } from './shared/services/backend-api.service';
import { AvatarPipe } from './shared/pipes/avatar-formatter.pipe';
import { MedalPipe } from './shared/pipes/medal-formatter.pipe';
import { DateFormatterPipe } from './shared/pipes/date-formatter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    Error404Component,
    LoginComponent,
    UpdateProfileComponent,
    ViewProfileComponent,
    MedalsComponent,
    RankingComponent,
    CalculatorComponent,
    NotificationsComponent,
    SendNotificationComponent,
    SelectAvatarComponent,
    HeaderComponent,
    CustomHeaderComponent,
    ErrorMessageComponent,
    AvatarPipe,
    MedalPipe,
    DateFormatterPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  exports: [AvatarPipe, MedalPipe, DateFormatterPipe],
  providers: [
    ModalService,
    SplashScreenService,
    HttpClientService,
    GlobalService,
    BackendAPIService,
    LookupsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
