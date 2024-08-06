import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { BottomMenuPage } from "../../shared/bottom-menu/bottom-menu.page";
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { CookieService } from 'ngx-cookie-service';
import { BookingService } from 'src/app/services/booking.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.page.html',
    styleUrls: ['./forgot-password.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, BottomMenuPage]
})
export class ForgotPasswordPage implements OnInit {
  resetForm = this.fb.group({
    email: ['', [Validators.required]],
    otp: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  otpSent:Boolean = false;
  email:string="";
  otp:any="";

  otp1: string = '';
  otp2: string = '';
  otp3: string = '';
  otp4: string = '';
  otp5: string = '';

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private userService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private cookieService: CookieService,
    private bookingService: BookingService,
  ) {}

  ngOnInit() {}
  register() {
    console.log('Register');
    this.router.navigate(['register']);

  }
  login() {
    console.log('login');
    this.router.navigate(['login']);

  }
  loginWithGoogle() {}
  loginWithFacebook() {}
  loginWithApple() {}
  // resetPassword() {
  //   if(this.resetPasswordForm.valid) {
  //     this.authService.resetPassword(this.resetPasswordForm.value.username)
  //   }else {
  //     this.resetPasswordForm.markAsDirty();
  //   }
  //   this.showPasswordResetSuccess();
  // }

  resendPassword(){
    this.authService.resendOTP(this.email).subscribe({
      next: () => {
        this.toastService
        .showToast(`OTP has been resent to ${this.email}`)
      
      },
      error: () => {
        // this.invalid = true;
      },
    });
  
  }

  termsAndConditions() {
    this.bookingService.getTermsAndConditions().subscribe({
      next:(response:any)=>{
      
       const browserRef =window.open(response,"_blank");
       browserRef&& browserRef.addEventListener( "loadstop", function() {
      });
      
      },
      error: (error) => {
        
        console.log('err', error);
      },
  
    })

  }


  async showPasswordResetSuccess() {
    const alert = await this.alertController.create({
      header: 'Success',
      subHeader: '',
      message: 'Your password has been reset, you may now login',
      cssClass: 'otp-alert',
      buttons: [
        {
          text: 'OK',
          cssClass: 'primary-btn',
        },
      ],
    });
    await alert.present();


  }

  async showOTPSentEmail() {
    const alert = await this.alertController.create({
      header: 'Success',
      subHeader: '',
      message: 'An OTP has been sent to your email address',
      cssClass: 'otp-alert',
      buttons: [
        {
          text: 'OK',
          cssClass: 'primary-btn',
        },
      ],
    });
    await alert.present();
  }

  resetPassword() {
    console.log(this.resetForm.value.email)
    const _email = this.resetForm.value.email
    this.userService.resetPassword(_email).subscribe((user:any)=>{
    this.otpSent = true;
    this.email = _email??"";
    this.showOTPSentEmail();

    },(error: any) => {
      if(error.status == 400 ){
        this.toastService.showToast('The OTP provided is invalid, please try again');
      }
        console.log(error['Errors']);
  });

  }

  completeResetPassword() {
    const email = this.email
    //const otp = this.resetForm.value.otp
    const otp=this.otp;
    const password = this.resetForm.value.password

    this.userService.verifyOTPAndResetPassword(email, otp, password).subscribe((result: any) => {
      this.cookieService.delete('password');
      this.cookieService.delete('rememberMe');
      this.showPasswordResetSuccess();
      this.router.navigateByUrl('login');
    },(error: any) => {
      if(error.status == 400 ){
        this.toastService.showToast('The OTP provided is invalid, please try again');
      }
        console.log(error['Errors']);
  });
  }


  // onOtpChange(e: any): void{
  //   //this.otpvalue=e;
  //   console.log(e)
  // }

  gotoNextField(nextElement: any, index:number, elem?:any) {
    var numberPattern = /^\d+$/;
    if (numberPattern.test(elem.value)) {
    switch(index){
      case 1:
        this.otp1=elem.value;
        break;
      case 2:
      this.otp2=elem.value;
      break;
      case 3:
        this.otp3=elem.value;
        break;
      case 4:
        this.otp4=elem.value;
        break;
      case 5:
        this.otp5=elem.value;
        break;
    }
    this.otp = `${this.otp1}${this.otp2}${this.otp3}${this.otp4}${this.otp5}`
        nextElement!='' && nextElement.setFocus();
        console.log(this.otp);
      }
    }

 


}
