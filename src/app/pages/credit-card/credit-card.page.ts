import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BottomMenuPage } from '../../shared/bottom-menu/bottom-menu.page';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Store } from '@ngrx/store';
import { BookingService } from 'src/app/services/booking.service';
import { ToastService } from 'src/app/services/toast.service';
import { resetBookings } from 'src/app/store/bookings/bookings.actions';
import { Customerservice } from 'src/app/services/customer.service';
import { ICustomer } from 'src/app/services/map/ICustomer';
import * as moment from 'moment';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.page.html',
  styleUrls: ['./credit-card.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    BottomMenuPage,
    ReactiveFormsModule,
  ],
})
export class CreditCardPage implements OnInit {
  booking: any;
  customerDetails: any;
  cardNumber = '';
  quoteId = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: AuthService,
    private cookieService: CookieService,
    private store: Store,
    private bookingsService: BookingService,
    private toastService: ToastService,
    private customerService: Customerservice
  ) {
    this.store
      .select((store: any) => store.bookings)
      .subscribe((res) => {
        this.booking = res.inProgressBookings;
      });
  }

  creditCardForm = this.fb.group({
    creditCard: ['', [Validators.required]],
    cvv: ['', [Validators.required]],
    expiryDate: ['', [Validators.required]],
    orderNumber:['']
  });

  savedCard = false;
  monthYears: any[] = [];
  name: string = '';
  expiryDate: string = '';
  cvv: string = '';
  customer: any;
  quote: any = {};
  ionViewDidEnter() {
    this.populateMonthYears();
    var user = JSON.parse(atob(this.cookieService.get('avis-user')));
    this.quoteId = this.bookingsService.currentQuoteId;
    this.bookingsService.getQuote(this.quoteId).subscribe((response: any) => {
      this.quote = response;
      // 
      this.customerDetails = response.customer;
      const cardNumberSplit = this.customerDetails.creditCardNumber.split('');

      let dash =0;
      cardNumberSplit.forEach((digit: any, index: number) => {
     
        if (index < cardNumberSplit.length - 4) {
          this.cardNumber += '* ';
          dash= dash+1;    
          if(dash==3){
          this.cardNumber+='- ';
          dash=0;
        }
        } else {
          this.cardNumber += digit;
        }
    

      });


    });
  }
  ngOnInit(): void {
    
  }

  formatDate(string: any) {
    return moment(string).format('MM YY');
  }
  
  updateCard() {
    const payload = {
      creditCardNumber: this.creditCardForm.value.creditCard?.toString(),
      creditCardExpiry: this.creditCardForm.value.expiryDate,
      CustomerId: this.customerDetails.customerId,
    } as ICustomer;

    this.customerService.updateCustomerCard(payload).subscribe({
      next: (customer: any) => {
        if (customer.customerId != null && customer.customerId != '') {
          this.toastService.showToast('Card has been updated succesfully.');
          this.cardNumber = '';
          const cardNumberSplit = customer.creditCardNumber.split('');
          cardNumberSplit.forEach((digit: any, index: number) => {
            if (index < customer.creditCardNumber.length - 4) {
              this.cardNumber += '*';
            } else {
              this.cardNumber += digit;
            }
          });
        }
      },
      error: (err) => {
        this.toastService.showToast(
          err.error.charAt(0).toUpperCase() + err.error.slice(1)
        );
      },
    });
  }

  changeCard() {
    (this.name = ''), (this.expiryDate = ''), (this.cvv = '');
  }
  getMonthYearString(month: number, year: number): string {
    const monthStr = month.toString().padStart(2, '0');
    return `${monthStr} ${year}`;
  }

  populateMonthYears() {
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear + 10; // Adjust the maximum year as needed
    for (let year = currentYear; year <= maxYear; year++) {
      for (let month = 1; month <= 12; month++) {
        const monthYear = this.getMonthYearString(month, year);
        this.monthYears.push({
          val: this.formatDate(monthYear),
          label: monthYear,
        });
      }
    }
  }
  cancel() {
    this.router.navigateByUrl('/bookings');
  }
  selectSavedCard() {}
  makeBooking() {
    const newBook = JSON.parse(JSON.stringify(this.booking));
    // 
    const _booking = {
      quoteNumber: this.quoteId,
      bookingNumber: '',
      frequentFlierNumber: this.customerDetails.frequentFlier,
      isIndividual: true,
      luxuryClubNumber: this.customerDetails.luxClubNumber,
      vatNumber: this.customerDetails.vatReg,
      bookingLegs: newBook,
      passengerName: this.customerDetails.custFullNames,
      passengerSurname: this.customerDetails.custSurname,
      passengerEmail: this.customerDetails.email,
      passengerWizardNo: this.customerDetails.wizardNumber,
      passengerMobile: {
        internationalDialingCode: '+27',
        number: this.customerDetails.cellphone,
        quoteNumber: this.quoteId,
      },
      orderNumber:this.creditCardForm.value.orderNumber,
    };
    _booking.bookingLegs.forEach((leg: any) => {
      leg.pax = leg.passengers ? leg.passengers.length.toString() : '1';
    });
    this.bookingsService.postBooking(_booking).subscribe((response: any) => {
      console.log(response);
      if (response.makeBookingResult.errors) {
        let msg = '';
        response.makeBookingResult.errors?.responseError.forEach((err: any) => {
          msg += `${err.message}`;
        });
        this.toastService.showToast(msg, 5000);
        this.router.navigateByUrl(`/booking`);
        return;
      }
      this.toastService.showToast(
        `Reservation ${response.makeBookingResult.bookingNumber} created succesfully.`
      );
      this.store.dispatch(resetBookings());
      this.router.navigateByUrl(
        `/booking-summary/${response.makeBookingResult.bookingNumber}`
      );
    });
  }
}
