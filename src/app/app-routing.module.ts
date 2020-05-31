import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "./pages/login/login.component";
import { UpdateProfileComponent } from "./pages/update-profile/update-profile.component";
import { ViewProfileComponent } from "./pages/view-profile/view-profile.component";
import { SelectAvatarComponent } from "./pages/select-avatar/select-avatar.component";
import { MedalsComponent } from "./pages/medals/medals.component";
import { RankingComponent } from "./pages/ranking/ranking.component";
import { CalculatorComponent } from "./pages/calculator/calculator.component";
import { NotificationsComponent } from "./pages/notifications/notifications.component";
import { SendNotificationComponent } from "./pages/send-notification/send-notification.component";
import {Error404Component} from './pages/error-404/error-404.component'

const appRoutes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "error-404", component: Error404Component ,data: { animation: 'error-404' }},
  { path: "login", component: LoginComponent ,data: { animation: 'login' }},
  { path: "update-profile", component: UpdateProfileComponent ,data: { animation: 'update-profile' }},
  { path: "view-profile", component: ViewProfileComponent ,data: { animation: 'view-profile' }},
  { path: "select-avatar", component: SelectAvatarComponent ,data: { animation: 'select-avatar' }},
  { path: "medals", component: MedalsComponent ,data: { animation: 'medals' }},
  { path: "ranking", component: RankingComponent ,data: { animation: 'ranking' }},
  { path: "calculator", component: CalculatorComponent ,data: { animation: 'calculator' }},
  { path: "notifications", component: NotificationsComponent ,data: { animation: 'notifications' }},
  { path: "send-notification", component: SendNotificationComponent ,data: { animation: 'send-notification' }},
  {
    path: "**",
    redirectTo: "error-404",
    pathMatch: "full"
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
