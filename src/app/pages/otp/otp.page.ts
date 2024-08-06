import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, Router,ParamMap} from '@angular/router';
import { BottomMenuPage } from '../../shared/bottom-menu/bottom-menu.page';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';


@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BottomMenuPage],
})
export class OtpPage implements OnInit {
  email: string = '';
  otp: string = '';
  invalid: boolean = false;
  focusToFirstElementAfterValueUpdate:boolean=false;    
  emailOtp: string | null | undefined;
  otp1: string = '';
  otp2: string = '';
  otp3: string = '';
  otp4: string = '';
  otp5: string = '';

  constructor(
    private alertController: AlertController,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    
  }

  ionViewDidEnter() {
    this.activatedRoute.queryParams.subscribe(params=>{
      let username=params['email'];
      this.email = username;
      localStorage.setItem('otpEmail', username);
      console.log(username);
    });

    this.emailOtp = localStorage.getItem('otpEmail');

 
  }

  limitInputLength($event:any, maxLength=1) {
    if($event.target.value.length>=maxLength) {
        $event.preventDefault();
        return;
    }
}

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

  onOtpChange(){

  }

  
  async requestOTP() {
    console.log('we are running otp');

    const alert = await this.alertController.create({
      header: 'Enter OTP',
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

  onComplete() {
    // this.router.navigate(['login']);

    this.activatedRoute.queryParams.subscribe((params) => {
      let email = params['email'];
      this.email = email;
      console.log(email); // Print the parameter to the console.
    });

    const payload = {
      Otp: this.otp,
    };

    this.authService.verifyOtp(this.email, this.otp).subscribe({
      next: (res) => {
        
        this.router.navigate(['login']);
        this.invalid = false;
      
      },
      error: (res) => {
        this.invalid = true;
        this.toast.showToast(
          'Invalid OTP. Please try again or request a new one.',
          3000
        );
      },
    });
  }
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
