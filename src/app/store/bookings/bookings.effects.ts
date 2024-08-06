import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { BookingService } from 'src/app/services/booking.service';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { IAvailableVehicles } from 'src/app/interfaces/availableVehicles.interface';
import { EmptyError } from 'rxjs';
import { Router } from '@angular/router';
import {
  loadBookings,
  loadBookingsFailure,
  loadBookingsSuccess,
} from './bookings.actions';

@Injectable()
export class BookingEffects {
  // load$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(loadBookings),
  //     exhaustMap(() =>
  //       this.bookingService.getBookings().pipe(
  //         map((response: any) => {
  //           const myBookings = response;
   
  //           return loadBookingsSuccess({
  //             bookings: response,
  //           });
  //         }),
  //         catchError(async (error) => {
  //           console.log(error);
  //           return loadBookingsFailure({
  //             error: 'Failed to load Your Bookings',
  //           });
  //         })
  //       )
  //     )
  //   )
  // );
  constructor(
    private actions$: Actions,
    private bookingService: BookingService,
    private router: Router
  ) {}
}
