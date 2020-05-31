import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendAPIService } from '../../shared/services/backend-api.service';
import { GlobalService } from '../../shared/services/global.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    public router: Router,
    public backendAPIService: BackendAPIService,
    private globalService: GlobalService
  ) {
    // redirect to home screen if user is already logged in
    this.globalService.onLoginScreen.next(true);
    if (this.globalService.isLoggedIn()) {
      var naviageteToUrl = environment.HOME_URL;
      if (!this.globalService.getAuthInfo().profile.userInfo) {
        naviageteToUrl = 'update-profile';
      }
      this.router.navigate([naviageteToUrl]);
      return;
    }
  }
  useCustomHeader: boolean = true;
  title = 'Interswitch Sales App';
  canBack = false;
  username: string;
  password: string;
  passwordField: any = {
    type: 'password',
    icon: 'show_password.png'
  };
  ngOnInit() {}

  ngOnDestroy() {
    this.globalService.onLoginScreen.next(false);
  }
  
  isConnecting: Boolean = false;
  signIn() {
    if (this.isConnecting) {
      return;
    }
    this.isConnecting = true;
    this.backendAPIService
      .login(this.username, this.password)
      .then(response => {
        this.isConnecting = false;
        var naviageteToUrl = environment.HOME_URL;
        if (!response.profile.userInfo) {
          naviageteToUrl = 'update-profile';
        }
        this.router.navigate([naviageteToUrl]).then(() => {
          this.globalService.onLoginScreen.next(false);
        });
      })
      .catch(error => {
        this.isConnecting = false;
      });
  }
  ChangePasswordFieldType() {
    if (this.passwordField.type == 'text') {
      this.passwordField.type = 'password';
      this.passwordField.icon = 'show_password.png';
    } else {
      this.passwordField.type = 'text';
      this.passwordField.icon = 'hide_password.png';
    }
  }
}
