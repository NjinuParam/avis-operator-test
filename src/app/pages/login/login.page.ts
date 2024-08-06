import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BottomMenuPage } from '../../shared/bottom-menu/bottom-menu.page';
import { LoadingService } from 'src/app/services/loading.service';
import { CookieService } from 'ngx-cookie-service';
import {
  Facebook,
  FacebookLoginResponse,
} from '@awesome-cordova-plugins/facebook/ngx';
import { Store } from '@ngrx/store';
import { resetBookings } from 'src/app/store/bookings/bookings.actions';
import { ToastService } from 'src/app/services/toast.service';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  providers: [AuthService, CookieService, Facebook],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BottomMenuPage,
  ],
})
export class LoginPage implements OnInit {
  passwordInputYype = 'password';
  _showPassword = false;
  termsAndConditionsUrl:string="";
  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });
  cookieValue = '';
  constructor(
    private fb: FormBuilder,
    private authSvc: AuthService,
    private router: Router,
    private platform: Platform,
    private cookieService: CookieService,
    private loadingService: LoadingService,
    private facebook: Facebook,
    private bookingService: BookingService,
    private store: Store,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService
  ) {
    
    this.activatedRoute.params.subscribe((params) => {

      this.store.dispatch(resetBookings());

    });
  }

  ionViewWillEnter(){
    const username = this.cookieService.get('username');
    const password = this.cookieService.get('password');
    this.passwordInputYype = 'password';
    this._showPassword = false;
    const rememberMe = this.cookieService.get('rememberMe');
    if (username) {
      this.loginForm.controls.username?.setValue(username);
    }
    if (password) {
      this.loginForm.controls.password?.setValue(password);
    }
    if (rememberMe=="true") {
      this.loginForm.controls.rememberMe?.setValue(true);
    }else{
      this.loginForm.controls.rememberMe?.setValue(false);
      this.loginForm.controls.password?.setValue('');
    }
  }

  ngOnInit() {

  }

  termsAndConditions() {
    this.bookingService.getTermsAndConditions().subscribe({
      next:(response:any)=>{
        // const byteArray = new Uint8Array(atob(response.result).split('').map(char => char.charCodeAt(0)));
        // var blob= new Blob([byteArray], {type: 'application/pdf'});
        // const url = window.URL.createObjectURL(blob);
        // // window.open(url, '_system', 'location=yes'); 
        // this.termsAndConditionsUrl=url;
        const browserRef =window.open(response,"_blank");
       browserRef&& browserRef.addEventListener( "loadstop", function() {
      });
      
      },
      error: (error) => {
        
        console.log('err', error);
      },
  
    })

  }
  async loginWithGoogle() {
    try {
      this.loadingService.setLoading(true, 'https://google.com');
      const result = await this.authSvc.loginWithGoogle();
      this.loadingService.setLoading(false, 'https://google.com');
     
      if (result) {
        
        this.router.navigate(['bookings']);
      }
    } catch (err) {
      this.loadingService.setLoading(false, 'https://google.com');
    }
  }

  async loginWithFacebook() {
    this.facebook
      .login(['public_profile', 'email'])
      .then(async (res: FacebookLoginResponse) => {
        console.log('Logged into Facebook!', JSON.stringify(res));
        const profile = await this.facebook.api('/me', [
          'public_profile',
          'email',
        ]);

        const payload = {
          ...res,
          ...profile,
        };
        console.log('payload', payload);
        const fbJson = JSON.stringify(payload, null, 2);
        const result = await this.authSvc.loginWithFacebook(fbJson);
        if (result) {
          this.router.navigate(['bookings']);
        }
      })
      .catch((e: any) => console.log('Error logging into Facebook', e));
    this.facebook.logEvent(this.facebook.EVENTS.EVENT_NAME_ADDED_TO_CART);
  }
  loginWithApple() {
    console.log('loginWithApple');
  }
  loginWithEmailPassword() {
    console.log('loginWithEmailPassword');
    if (this.loginForm.invalid) {
      console.log('failed');
      this.loginForm.markAllAsTouched();
      return;
    }
    if (this.loginForm.value.username && this.loginForm.value.password) {
      const { username, password } = this.loginForm.value;
      this.authSvc.loginWithEmail(username, password).subscribe(
        (resp) => {
          this.cookieService.set('avis-user', btoa(JSON.stringify(resp)));
          if (this.loginForm.controls.rememberMe?.value) {
            this.cookieService.set('username', username);
            this.cookieService.set('password', password);
            this.cookieService.set('rememberMe', 'true');
          } else {
  
            this.cookieService.delete('rememberMe');
          }

          this.router.navigate(['bookings']);
        },
        (err) => {
          if (err?.error?.error) {
            this.toastService.showToast(err?.error?.error);
          } else {
            this.toastService.showToast('Login failed, please try again');
          }
        }
      );
    }
  }
  showPassword() {
    if (this.loginForm.value.password === '') {
      this.passwordInputYype = 'password';
      this._showPassword = false;
      return;
    }
    this._showPassword = !this._showPassword;
    if (this._showPassword) {
      this.passwordInputYype = 'text';
    } else {
      this.passwordInputYype = 'password';
    }
  }
  forgotPassword() {
    console.log('Forgot Password');
    this.router.navigate(['forgot-password']);
  }
  register() {
    console.log('Register');
    this.router.navigate(['register']);
  }
}
