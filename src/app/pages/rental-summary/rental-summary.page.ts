import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import {
  addBooking,
  removeBookingFromInProgressBookings,
} from 'src/app/store/bookings/bookings.actions';
import { mapBooking } from 'src/app/services/map/map_IBookingToBooking';
import { _IBooking } from 'src/app/services/map/_IBooking';
import { BookingService, _BookingData } from 'src/app/services/booking.service';
import { ToastService } from '../../services/toast.service';
import { BottomMenuPage } from 'src/app/shared/bottom-menu/bottom-menu.page';
@Component({
  selector: 'app-rental-summary',
  templateUrl: './rental-summary.page.html',
  styleUrls: ['./rental-summary.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BottomMenuPage],
})
export class RentalSummary implements OnInit {
  bookings: any[] = [];
  booking: any;
  quoteCreated: boolean = false;
  subTotal: number = 0;
  total: number = 0;
  quoteId: string = '';
  constructor(
    private store: Store,
    private router: Router,
    private bookingService: BookingService,
    private toastService: ToastService
  ) {
    this.store
      .select((store: any) => store.bookings)
      .subscribe((res) => {
        this.bookings = JSON.parse(JSON.stringify(res.inProgressBookings));

        // this.bookings.forEach((booking) => {

        //   this.bookings=booking;
        //   booking.total = 0;
        //   booking.vehicle?.feeBreakdown?.fee.forEach((fee: any) => {
        //     booking.total += parseFloat(fee.price);
        //   });
        // });
      });

    this.store
      .select((store: any) => store.bookings)
      .subscribe((res) => (this.booking = res.selectedBooking));

    console.log('PPOOO', this.booking);
  }

  ionViewWillEnter() {
    this.store
      .select((store: any) => store.bookings)
      .subscribe((res) => (this.booking = res.selectedBooking));

    this.calculateTotal();
  }
  calculateTotal() {
    let subTotal = 0;
    this.booking.vehicle?.feeBreakdown?.fee.forEach((fee: any) => {
      subTotal += parseFloat(fee.price);
    });

    const acctotal = this.booking.selectedAccessories.reduce(
      (acc: any, curr: any) => acc + parseFloat(curr.cost) * curr.qty,
      0
    );

    this.subTotal = subTotal;
    this.total = parseFloat(subTotal.toString()) + parseFloat(acctotal);
  }
  // this.selectedBookingSubscription = this.store
  // .select((store: any) => store.bookings)
  // .subscribe((res) => {
  //   this.booking = res.selectedBooking;
  //   this.booking?.vehicle?.feeBreakdown?.fee.forEach((fee: any) => {
  //     this.total += parseFloat(fee.price);
  //   });
  // });

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
        console.log(response);
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
  getExtraTotal(extra: any) {
    const res = parseFloat(extra.cost) * parseFloat(extra.qty);
    return res;
  }

  backToSummary() {
    this.router.navigateByUrl('/vehicle-details');
  }
  ngOnInit() {}
  continue() {
    this.router.navigateByUrl('/conditions');
  }

  viewQuotes() {
    this.router.navigateByUrl(`/quote-summary/${this.quoteId}`);
  }

  edit(booking: any) {
    this.store.dispatch(
      addBooking({
        booking: {
          ...booking,
        },
      })
    );
    this.store.dispatch(
      removeBookingFromInProgressBookings({
        booking: {
          ...booking,
        },
      })
    );
    this.router.navigateByUrl('/available-booking-types');
  }
  back(booking: any) {
    this.store.dispatch(
      removeBookingFromInProgressBookings({
        booking: {
          ...booking,
        },
      })
    );

    this.store.dispatch(
      addBooking({
        booking: {
          ...booking,
        },
      })
    );

    window.history.back();
  }
}
