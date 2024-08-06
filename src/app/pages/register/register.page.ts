import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { BottomMenuPage } from '../../shared/bottom-menu/bottom-menu.page';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { BookingService } from 'src/app/services/booking.service';

class PasswordValidator {
  static ValidPassword(control: FormControl): any {
    if (control.value != undefined) {
      if (control.value.length < 8) {
        return { invalidPassword: true };
      }

      // Define a regular expression pattern to match special characters
      const specialCharPattern = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\]/;

      // Check if the string contains at least one special character
      if (!specialCharPattern.test(control.value)) {
        return { invalidPassword: true };
      }
    }
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BottomMenuPage,
  ],
})
export class RegisterPage implements OnInit {
  _showPassword = false;
  passwordInputType = 'password';
  repasswordInputType = 'password';

  /*
          {"firstName":"tester","lastName":"tester 100","contactNumber":"07411313","emailAddress":"tester@gmail.com","roseNumber":"13132","password":"@li987AA","confirmPassword":"@li987AA"}
  */

  isWizardNumber: boolean = false;
  registerForm = this.fb.group({
    wizzardNo: ['', this.IsWizardValidation()],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    contactNumber: ['', Validators.required],
    emailAddress: ['', Validators.required],
    // type: ['', Validators.required],
    password: ['', PasswordValidator.ValidPassword],
    confirmPassword: [
      '',
      [Validators.required, this.RetypeConfirm('password')],
    ],
  });

  valid: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private bookingService: BookingService,
  ) {}

  ngOnInit() {}

  switch() {
    this.isWizardNumber = !this.isWizardNumber;
    if (!this.isWizardNumber) {
      this.registerForm.controls.wizzardNo.setErrors(null);
    }
  }

  RetypeConfirm(confirmpassword: string) {
    return (control: FormControl): { [key: string]: boolean } | null => {
      if (!control || !control.parent) {
        return null;
      }
      if (control.value !== this.registerForm.value.password) {
        return { mismatch: true };
      }
      return null;
    };
  }

  IsWizardValidation() {
    return (control: FormControl): { [key: string]: boolean } | null => {
      if (!control || !control.parent) {
        return null;
      }
      if (control.value.length < 4 && this.isWizardNumber) {
        return { mismatch: true };
      }
      return null;
    };
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

  checkValid() {
    this.valid =
      (this.isWizardNumber ? this.registerForm.value.wizzardNo != '' : true) &&
      this.registerForm.value.emailAddress != undefined &&
      this.registerForm.value.emailAddress != '' &&
      this.registerForm.value.firstName != undefined &&
      this.registerForm.value.firstName != '' &&
      this.registerForm.value.lastName != undefined &&
      this.registerForm.value.lastName != '' &&
      this.registerForm.value.password != undefined &&
      this.registerForm.value.password != '' &&
      this.registerForm.value.confirmPassword != undefined &&
      this.registerForm.value.confirmPassword ==
        this.registerForm.value.password;
  }

  register() {
    console.log('what is the values', this.registerForm.value);
    console.log('what is the values', this.registerForm.invalid);
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    console.log('what is the values', this.registerForm.value);

    this.authService
      .registerWithEmailAndPassword(this.registerForm.value)
      .subscribe({
        next: (res: any) => {
          // if(res.status ==200){
          this.router.navigateByUrl(
            `otp?email=${this.registerForm.value.emailAddress}`
          );
          //         }
        },
        error: (err) => {
        
          if (err.status == 400) {
            this.toastService.showToast(err.error?.error);
          }
        },
      });
    //       .subscribe((res:any) =>{
    //         if(res.status ==200){
    //           this.router.navigateByUrl(
    //             `otp?email=${this.registerForm.value.emailAddress}`
    //           )
    //         }

    //         if(res.status ==400){
    //           this.toastService.showToast(
    //             res.data
    //           );
    //         }

    //       }

    //       );
  }

  showPassword() {
    this._showPassword = !this._showPassword;
    if (this._showPassword) {
      this.passwordInputType = 'text';
      this.repasswordInputType = 'text';
    } else {
      this.passwordInputType = 'password';
      this.repasswordInputType = 'password';
    }
  }

  login() {
    console.log('Login');
    this.router.navigate(['login']);
  }
}
