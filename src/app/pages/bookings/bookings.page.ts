import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { BottomMenuPage } from '../../shared/bottom-menu/bottom-menu.page';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  addBooking,
  addToInprogressBookings,
  clearInprogressBookings,
  loadBookings,
  removeBookingFromInProgressBookings,
  resetBookings,
  setUpcomingBookings,
} from 'src/app/store/bookings/bookings.actions';
import { BookingService } from 'src/app/services/booking.service';
import { IBookingView } from 'src/app/interfaces/booking.interface';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { ToastService } from 'src/app/services/toast.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BottomMenuPage],
})
export class BookingsPage implements OnInit, OnDestroy {
  activePage = 't1';
  bookings: IBookingView[] = [];
  upcomingBookings: any[] = [];
  cancelledBookings: any[] = [];
  pastBookings: any[] = [];
  selectedBookings: any[] = [];
  quotes: any[] = [];
  isQuote = false;
  loading = true;

  ongoingBookings: any[] = [];
  constructor(
    private store: Store,
    private bookingService: BookingService,
    private router: Router,
    private BookingService: BookingService,
    private cookieService: CookieService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      store.dispatch(resetBookings());
      this.loadCustomerManifest();
    });
  }
  loadCustomerManifest() {
    var user = JSON.parse(atob(this.cookieService.get('avis-user')));
    const customerCode = user.customerId;
    console.log('getting manifest');
    this.bookingService.currentQuoteId = '';
    console.clear();
    console.log('currentQuoteId', this.bookingService.currentQuoteId);
    this.GetBookingsManifestByCustomerCode(customerCode);
  }
  ngOnDestroy(): void {}

  isHistoric(date: string) {
    const bookingDate = new Date(date);
    const todaysDate = new Date();
    const isSameFixed = moment(todaysDate)
      .utc()
      .isAfter(moment(bookingDate).utc(), 'day');
    return isSameFixed;
  }

  isToday(date: string) {
    const bookingDate = new Date(date);
    const todaysDate = new Date();
    const isSameFixed = moment(todaysDate)
      .utc()
      .isSame(moment(bookingDate).utc(), 'day');
    return isSameFixed;
  }

  formatDate(string: any) {
    return moment(string).format(' DD MMM YY');
  }
  scaffold(bookings: IBookingView[]) {
    this.upcomingBookings = this.bookings.filter((booking) => {
      //1st leg is most recent
      const pickupDate = booking.legs[0].pickUpDate ?? '';
      const isInFuture = this.isHistoric(pickupDate);

      return isInFuture;
    });
    // this.upcomingBookings = this.bookings;
    this.pastBookings = this.bookings.filter((booking) => {
      //1st leg is most recent
      const dropOffDate = booking.legs.splice(-1)[0].dropOffDate ?? '';
      const isPast = this.isHistoric(dropOffDate) && !this.isToday(dropOffDate);
      return isPast;
    });

    this.ongoingBookings = this.bookings.filter((booking) => {
      //1st leg is most recentc
      const pickupDate = booking.legs[0].pickUpDate ?? '';
      const dropOffDate = booking.legs.splice(-1)[0].dropOffDate ?? '';

      const isInFuture = !this.isHistoric(pickupDate);
      const isPast = this.isHistoric(dropOffDate) && !this.isToday(dropOffDate);

      return !isInFuture && !isPast;
    });
    console.log('ongoingBookings', this.ongoingBookings);
    console.log('pastBookings', this.pastBookings);
    console.log('upcomingBookings', this.upcomingBookings);
  }

  view(booking: IBookingView) {

    const p =  this.activePage;
    booking.legs.map((x) => {
      this.store.dispatch(
        addBooking({
          booking: x,
        })
      );
    });
    if (this.isQuote) {
      this.router.navigateByUrl(`/quote-summary/${booking.bookingId}`);
    } else {
      this.router.navigateByUrl(`/booking-summary/${booking.bookingId}?editable=${this.activePage==='t1'}`);
    }
  }

  edit(booking: any) {
    booking.legs.map((x: any) => {
      this.store.dispatch(
        addToInprogressBookings({
          booking: x,
        })
      );
    });
    this.router.navigateByUrl('/review-quote');
  }
  ngOnInit(): void {
    
  }
  ionViewDidEnter() {}
  ionViewWillEnter() {
    // this.store.dispatch(loadBookings());
    this.store
      .select((store: any) => store.bookings.allBookings)
      .subscribe((bookings: any[]) => {
        this.bookings = bookings;
        this.scaffold(bookings);
      });
  }
  GetBookingsManifestByCustomerCode(customerCode: string): void {
    //NK: todo: pass in agent details
    this.loading = true;
    this.BookingService.getBookingManifestByCustomerCode(
      customerCode
    ).subscribe({
      next: (bookings: any) => {
        this.quotes = bookings.quotes ?? [];
        this.upcomingBookings = bookings.upcomingBookings ?? [];
        this.pastBookings = bookings.historicBookings ?? [];
        this.cancelledBookings = bookings.cancelled ?? [];
        this.loading = false;
        this.store.dispatch(
          setUpcomingBookings({
            bookings: [...this.upcomingBookings, ...this.pastBookings],
          })
        );

        this.segmentChanged({
          detail: {
            value: this.activePage,
          },
        });
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  updateCard() {}

  segmentChanged(event: any) {
    console.log(this.upcomingBookings);
    this.activePage = event.detail.value;
    this.isQuote = false;
    switch (event.detail.value) {
      case 't1':
        this.selectedBookings = JSON.parse(
          JSON.stringify(this.upcomingBookings)
        );
        break;
      case 't2':
        this.selectedBookings = JSON.parse(JSON.stringify(this.pastBookings));
        break;
      case 't3':
        this.selectedBookings = JSON.parse(
          JSON.stringify(this.cancelledBookings)
        );
        break;
      case 't4':
        this.selectedBookings = JSON.parse(JSON.stringify(this.quotes));
        this.isQuote = true;
        break;
    }
  }
  cancel(booking: any) {
    this.BookingService.cancelBooking(
      booking.bookingId,
      booking.customerName
    ).subscribe(
      (response: any) => {
        if (
          response.cancelBookingRequestResult &&
          response.cancelBookingRequestResult &&
          response.cancelBookingRequestResult.errors
        ) {
          const message =
            response.cancelBookingRequestResult.errors.responseError[0].message;
          this.toastService.showToast(message, 5000);
        } else {
          this.toastService.showToast(
            `Order# ${booking.bookingId} was succesfully cancelled.`
          );
          this.loadCustomerManifest();
        }
      }
      // (error) =>
      //   this.toastService.showToast(
      //     'An error occured while cancelling your order.'
      //   )
    );
  }
  doSearch(event: any) {
    console.log('err', event.detail.value, this.activePage);
    // if (event.detail.value) {
    switch (this.activePage) {
      case 't1':
        this.selectedBookings = !event.detail.value
          ? this.upcomingBookings
          : this.upcomingBookings.filter((booking) =>
              booking.bookingId.includes(event.detail.value)
            );
        break;
      case 't2':
        this.selectedBookings = !event.detail.value
          ? this.pastBookings
          : this.pastBookings.filter((booking) =>
              booking.bookingId.includes(event.detail.value)
            );
        break;
      case 't3':
        this.selectedBookings = !event.detail.value
          ? this.cancelledBookings
          : this.cancelledBookings.filter((booking) =>
              booking.bookingId.includes(event.detail.value)
            );
        break;
      case 't4':
        this.selectedBookings = !event.detail.value
          ? this.quotes
          : this.quotes.filter(
              (booking) =>
                booking.bookingId?.includes(event.detail.value) ||
                booking.quotesNumber?.includes(event.detail.value)
            );
        break;
    }
    // }
    // this.bookings.map(x=>x.legs).forEach((booking) => {
    //   if (event.detail.value === '') {
    //     booking.hide = false;
    //   } else if (
    //     !booking.map(b=>b.vehicle?.description
    //       .toLowerCase()
    //       .includes(event.detail.value.toLowerCase())
    //   )) {
    //     booking.hide = true;
    //   }
    // });
  }
  enquire(booking: any, stageNumber: string) {
    this.router.navigate(['enquiry', booking.bookingId, stageNumber]);
  }

  invoice(booking: any, stageNumber: number) {
    
    this.router.navigateByUrl(`/pdf?bookingId=${booking.bookingId}&stage=${stageNumber}`);
  }

  finalize(booking: any) {
    booking.legs.map((x: any) => {
      this.store.dispatch(
        addToInprogressBookings({
          booking: x,
        })
      );
    });
    this.router.navigateByUrl('/conditions');


  }
}
