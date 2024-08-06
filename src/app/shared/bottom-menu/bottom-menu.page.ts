import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Store } from '@ngrx/store';
import { resetBookings } from 'src/app/store/bookings/bookings.actions';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-bottom-menu',
  templateUrl: './bottom-menu.page.html',
  styleUrls: ['./bottom-menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class BottomMenuPage implements OnInit {
  constructor(
    private router: Router,
    private cookieService: CookieService,
    private store: Store,
    private bookingsService: BookingService
  ) {}

  ionViewDidEnter() {}
  ngOnInit(){}
  home() {
    this.bookingsService.currentQuoteId =
      this.bookingsService.currentBookingId = '';
    this.store.dispatch(resetBookings());
    this.router.navigateByUrl('/home');
  }

  bookings() {
    this.router.navigateByUrl('/bookings');
  }

  newBooking() {
    this.bookingsService.currentQuoteId =
      this.bookingsService.currentBookingId = '';
    this.store.dispatch(resetBookings());
    this.router.navigateByUrl('/available-booking-types');
  }

  profile() {
    this.router.navigateByUrl('/profile');
  }
  help() {
    this.router.navigateByUrl('/emergency');
  }

  logOut() {
    this.cookieService.delete('avis-user');
    this.router.navigateByUrl('/login');
  }
}
