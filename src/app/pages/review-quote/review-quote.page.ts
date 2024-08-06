import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  addBooking,
  removeBookingFromInProgressBookings,
} from 'src/app/store/bookings/bookings.actions';
import { _IBooking } from 'src/app/services/map/_IBooking';
import { BookingService, _BookingData } from 'src/app/services/booking.service';
import { ToastService } from '../../services/toast.service';
import { BottomMenuPage } from 'src/app/shared/bottom-menu/bottom-menu.page';

@Component({
  selector: 'app-review-quote',
  templateUrl: './review-quote.page.html',
  styleUrls: ['./review-quote.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BottomMenuPage],
})
export class ReviewQuotePage implements OnInit {
  bookings: any[] = [];
  selectedBooking: any;
  quoteCreated: boolean = false;
  subTotal: number = 0;
  total: number = 0;
  quoteId: string = '';
  currentQuoteId = '';
  constructor(
    private store: Store,
    private router: Router,
    private bookingService: BookingService,
    private toastService: ToastService,
    private location: Location
  ) {
    this.store
      .select((store: any) => store.bookings)
      .subscribe((res) => {
        this.bookings = JSON.parse(JSON.stringify(res.inProgressBookings));

        var res  = res.inProgressBookings.bookingLegs.flatMap((leg: any) => {
          return leg._uploadFiles
  
        });



        
      });

    this.store
      .select((store: any) => store.bookings)
      .subscribe((res) => {
        this.selectedBooking = res.selectedBooking;
      });

    

  }

  calculateTotal(booking: any) {
    let _total = 0;

    _total += booking?.selectedAccessories?.reduce(
      (acc: any, curr: any) => acc + parseFloat(curr.cost) * curr.qty,
      0
    );
    booking.vehicle?.feeBreakdown?.fee.forEach((fee: any) => {
      _total += parseFloat(fee.price);
    });
    return _total;
  }
  // this.selectedBookingSubscription = this.store
  // .select((store: any) => store.bookings)
  // .subscribe((res) => {
  //   this.booking = res.selectedBooking;
  //   this.booking?.vehicle?.feeBreakdown?.fee.forEach((fee: any) => {
  //     this.total += parseFloat(fee.price);
  //   });
  // });

  private async readAsBase64(webpath: string) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(webpath!);
    const blob = await response.blob();
    return blob;
  }

  createQuote() {
    // const booking = {
    //   legs:this.bookings,
    //   customer:this.bookings[0].customer
    // } as _IBooking;

    const booking = [...this.bookings];
    const _booking = {
      quoteNumber: this.quoteId ?? '',
      bookingNumber: '',
      isIndividual: true,
      customer: this.bookings[0].customer,
      bookingLegs: booking,
    } as _BookingData;

    // const quotePayload = mapBooking(booking);

    const quotePayload = this.bookingService.populateBookingData(_booking);
    if (this.bookingService.currentQuoteId) {
      quotePayload.quoteNumber = this.bookingService.currentQuoteId;
    }
    quotePayload.Iata = '21';
    const res = this.bookingService.postQuote(quotePayload).subscribe({
      next: (response: any) => {
        let errorMessage = '';
        if (
          response.makeQuoteResult.errors &&
          response.makeQuoteResult.errors.responseError
        ) {
          response.makeQuoteResult.errors.responseError.forEach(
            (error: any) => {
              errorMessage += `${error.message}`;
              this.toastService.showToast(errorMessage);
              return;
            }
          );
        }
        if (errorMessage) {
          return;
        }
        var res  = _booking.bookingLegs.flatMap((leg: any) => {
          return leg._uploadFiles

        });
        this.sendDocuments(res, response.makeQuoteResult.quoteNumber)
        
        this.store.dispatch(addBooking({ booking: null }));
        this.quoteId = response.makeQuoteResult.quoteNumber;
        this.bookingService.currentQuoteId = this.quoteId;
        this.toastService.showToast(
          `Quote ${response.makeQuoteResult.quoteNumber} created succesfully. You may view your quote or confirm your booking below.`
        );
        this.bookingService.currentQuoteId =
          response.makeQuoteResult.quoteNumber;
        console.log('resss', response);
        this.quoteCreated = true;

      
      },
      error: (error) => {
        this.quoteCreated = true;
        this.toastService.showToast('An error occured while creating quote.');

        console.log('err', error);
      },
    });
  }

 async sendDocuments (params:any, quoteNumber:string) {

const p =[];
const bookingDocuments = new FormData();
for (let index = 0; index < params.length; index++) {
  const element = params[index];
  const res = await this.readAsBase64(element.webPath);
  bookingDocuments.append(`file${index}`, res);
}


  bookingDocuments.append("quoteNumber", quoteNumber);
  
  
  this.bookingService.postAddQuoteDocuments(bookingDocuments).subscribe({
    next:(response:any)=>{
      console.log("res", response);
    },
    error: (error) => {
      this.quoteCreated = true;
      this.toastService.showToast('An error occured while adding documents');

      console.log('err', error);
    },

  })



  }
ngOnInit(): void {
  
}

  getExtraTotal(extra: any) {
    const res = parseFloat(extra.cost) * parseFloat(extra.qty);
    return res;
  }
  ionViewDidEnter() {
    this.currentQuoteId = this.bookingService.currentQuoteId;
  }
  continue() {
    this.router.navigateByUrl('/conditions');
  }

  viewQuotes() {
    this.router.navigateByUrl(`/quote-summary/${this.quoteId}`);
  }

  delete(booking: any) {
    this.store.dispatch(
      removeBookingFromInProgressBookings({
        booking: {
          ...booking,
        },
      })
    );
    if (booking.appBookingId === this.selectedBooking.appBookingId) {
      this.store.dispatch(addBooking({ booking: null }));
    }
  }

  edit(booking: any) {
    this.store.dispatch(
      removeBookingFromInProgressBookings({
        booking: { ...booking },
      })
    );

    this.store.dispatch(
      addBooking({
        booking: {
          ...booking,
        },
      })
    );
    this.router.navigateByUrl('/available-booking-types/edit');
  }
  back() {
    this.store.dispatch(
      removeBookingFromInProgressBookings({
        booking: {
          ...this.selectedBooking,
        },
      })
    );

    this.location.back();
  }
}
