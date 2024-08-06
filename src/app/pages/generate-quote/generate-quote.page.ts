import { Component, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  addBooking,
  addToInprogressBookings,
  removeBookingFromInProgressBookings,
} from 'src/app/store/bookings/bookings.actions';
import { Subscription } from 'rxjs';
import { BottomMenuPage } from 'src/app/shared/bottom-menu/bottom-menu.page';

@Component({
  selector: 'app-generate-quote',
  templateUrl: './generate-quote.page.html',
  styleUrls: ['./generate-quote.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BottomMenuPage],
})
export class GenerateQuotePage implements OnDestroy {
  booking: any;
  selectedBookingSubscription: Subscription | undefined;
  total = 0;
  includeEmail: boolean = false;
  constructor(
    private router: Router,
    private store: Store,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {
    this.selectedBookingSubscription = this.store
      .select((store: any) => store.bookings)
      .subscribe((res) => {
        this.booking = res.selectedBooking;
        this.booking?.vehicle?.feeBreakdown?.fee.forEach((fee: any) => {
          this.total += parseFloat(fee.price);
        });
      });

    this.activatedRoute.params.subscribe((params) => {
      this.store.dispatch(
        removeBookingFromInProgressBookings({
          booking: {
            ...this.booking,
          },
        })
      );

      // this.store
      //   .select((store: any) => store.bookings)
      //   .subscribe((res) => {
      //     if (
      //       res.selectedBooking == null &&
      //       res.inProgressBookings.length == 0
      //     ) {
      //       this.router.navigateByUrl('/bookings');
      //     } else if (
      //       res.selectedBooking == null &&
      //       res.inProgressBookings.length > 0
      //     ) {
      //       store.dispatch(
      //         addBooking({ booking: { ...res.inProgressBookings[0] } })
      //       );
      //     }
      //   });
    });
  }

  back(){
    this.router.navigateByUrl('/add-note');
  }

  getBookingLegTotal(_booking: any) {
    const acctotal = this.booking?.selectedAccessories?.reduce(
      (acc: any, curr: any) => acc + parseFloat(curr.cost) * curr.qty,
      0
    );

    const _totalfees = this.booking?.vehicle?.feeBreakdown?.fee?.reduce(
      (acc: any, curr: any) => acc + parseFloat(curr.price),
      0
    );

    const totalfees = parseFloat(_totalfees) + parseFloat(acctotal);

    return totalfees;
  }

  ngOnDestroy(): void {
    this.selectedBookingSubscription?.unsubscribe();
  }

  onBack() {
    this.router.navigateByUrl('/add-note');
  }

  getExtraTotal(extra: any) {
    const res = parseFloat(extra.cost) * parseFloat(extra.qty);
    return res;
  }

  filteredAccessories() {
    return this.booking?.selectedAccessories?.filter(
      (accessory:any) => accessory.qty != 0 && accessory.qty != '0'
    );
  }

  continue() {
    const selectedBooking = {
      ...this.booking,
    };
    this.store.dispatch(addToInprogressBookings({ booking: selectedBooking }));
    // this.store.dispatch(addBooking({ booking: null }));
    this.router.navigateByUrl('/review-quote');
  }

  emailQuote() {
    this.includeEmail = !this.includeEmail;
  }
  onAnother() {
    const updatedBooking = {
      ...this.booking,
    };

    this.store.dispatch(addToInprogressBookings({ booking: updatedBooking }));
    this.store.dispatch(addBooking({ booking: null }));
    this.router.navigateByUrl('/available-booking-types');
  }
}
