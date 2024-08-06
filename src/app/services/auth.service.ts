import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import { ToastService } from './toast.service';


// import { FacebookLogin } from '@capacitor-community/facebook-login';
// import {  registerWebPlugin } from '@capacitor/core';
// registerWebPlugin(FacebookLogin);
// use hook after platform dom ready
GoogleAuth.initialize({
  clientId:
    // '17023308128-4cb7ou2v3e2gusf0onrbguold52u0qpo.apps.googleusercontent.com',
    '32817723217-5safi3926cmj8dc38dmusjpilvv4k4d9.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  grantOfflineAccess: true,
});

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.baseUrl;
  user: any;

  constructor(
    private httpClient: HttpClient,
    private platform: Platform,
    private toastService: ToastService
  ) {
    this.platform.ready().then(() => {
      GoogleAuth.initialize();
    });
  }
  async setupFbLogin() {
    // if (isPlatform('desktop')) {
    //   this.fbLogin = FacebookLogin;
    // } else {
    //   // Use the native implementation inside a real app!
    //   const { FacebookLogin } = Plugins;
    //   this.fbLogin = FacebookLogin;
    // }
  }
  async loginWithFacebook(facebookUser: any) {
    console.log(facebookUser);

    if (facebookUser) {
      return new Promise<any>((resolve) => {
        console.log(this.baseUrl + environment.api.socialLogin, facebookUser);
        this.httpClient
          .post(this.baseUrl + environment.api.socialLogin, facebookUser)
          .subscribe({
            next: () => resolve(true),
            error: () => resolve(false),
          });
      });
    } else {
      this.toastService.showToast('Login failed');
      return new Promise<any>((resolve, reject) => {
        reject(false);
      });
    }
  }
  async loginWithGoogle() {
    let googleUser = await GoogleAuth.signIn();

    console.log(googleUser);
debugger;
    if (googleUser) {
      return new Promise<any>((resolve, reject) => {
       var body ={
          email: googleUser.email,
          firstName: googleUser.givenName,
          lastName: googleUser.familyName,
          secret: googleUser.id,
          socialType: 'google',
          picture: googleUser.imageUrl,
          accessToken: googleUser.authentication.idToken,

       };
       debugger;
        this.httpClient
          .post(this.baseUrl + environment.api.socialLogin, body)
          .subscribe({
            next: () => {resolve(true)},
            error: () => {resolve(false)},
          });
      });
    } else {
      this.toastService.showToast('Login failed');
      return new Promise<any>((resolve, reject) => {
        reject(false);
      });
    }
  }

  loginWithEmail(username: string, password: string) {
    return this.httpClient
      .post(this.baseUrl + environment.api.login + '?hideToast=true', {
        username,
        password,
      })
      .pipe(
        tap((result) => {
          console.log(result);
          this.user = result;
        })
      );
  }

  registerWithEmailAndPassword(registrationInfomation: any) {
    return this.httpClient
      .post(this.baseUrl + environment.api.register, registrationInfomation)
      .pipe(
        tap((result) => {
          this.userOtp(result, 'OTP HERE');
        })
      );
  }

  getUserByEmail(email: any) {
    return this.httpClient
      .post(`${this.baseUrl}User/getByEmail`, { email: email })
      .pipe(
        tap((result) => {
          this.userOtp(result, 'USEER HERE');
        })
      );
  }

  getCustomer(customerId: any) {
    return this.httpClient.get(`${this.baseUrl}Customer/${customerId}`).pipe(
      tap((result) => {
        this.userOtp(result, 'USEER HERE');
      })
    );
  }
  verifyOtp(email: string, payload: any) {
    console.log(`${this.baseUrl}${email}`);
    return this.httpClient
      .post(
        `${this.baseUrl}User/registerCustomer/completeotp/${email}/${payload}`,
        {}
      )
      .pipe(
        tap((result) => {
          console.log(result);
        })
      );
  }

  userOtp(id: any, otp: string) {
    const payload = { otp: otp };
    console.log(`${this.baseUrl}${environment.api.otp}${id}`);
    return this.httpClient
      .post(`${this.baseUrl}${environment.api.otp}${id}`, { payload })
      .pipe(
        tap((result) => {
          console.log(result);
        })
      );
  }

  resetPassword(email: string | null | undefined) {
    return this.httpClient.post(`${this.baseUrl}User/password/reset/otp`, {
      email: email,
    });
  }

  verifyOTPAndResetPassword(
    email: string | null | undefined,
    otp: string | null | undefined,
    password: string | null | undefined
  ) {
    return this.httpClient.put(`${this.baseUrl}User/password/reset/${email}`, {
      otp: `${otp}`,
      password: password,
    });
  }

  resendOTP(
    email: string | null | undefined
  ) {
    return this.httpClient.put(`${this.baseUrl}User/password/resend/${email}`, {});
  }

}

