import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BottomMenuPage } from "../../shared/bottom-menu/bottom-menu.page";
import { AuthService } from 'src/app/services/auth.service';
import { BookingService } from 'src/app/services/booking.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.page.html',
    styleUrls: ['./reset-password.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, BottomMenuPage]
})
export class ResetPasswordPage implements OnInit {
  resetForm = this.fb.group({
    newPassword: ['', [Validators.required]],
    confirmNewPassword: ['', [Validators.required]],
    email: ['', [Validators.required]],
  });
  constructor(private fb: FormBuilder,  private userService: AuthService,    private bookingService: BookingService) {}

  ngOnInit() {}
  register() {}
  resetPassword() {
    const email = this.resetForm.value.email
    this.userService.resetPassword(email).subscribe((user:any)=>{
      console.log("USERERE", user)
      
    });

  }

  completeResetPassword() {
    const email = this.resetForm.value.email
    const otp = this.resetForm.value.email
    const password = this.resetForm.value.email

    this.userService.verifyOTPAndResetPassword(email, otp, password).subscribe((user:any)=>{
      console.log("USERERE", user)
      
    });

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



  loginWithGoogle() {
    console.log('loginWithGoogle');
  }
  loginWithFacebook() {
    console.log('loginWithFacebook');
  }
  loginWithApple() {}

}
