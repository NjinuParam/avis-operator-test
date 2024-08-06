import { createAction, props } from '@ngrx/store';
import { IBookingType } from 'src/app/interfaces/bookingType.interface';

export const LOAD_BOOKING_TYPES = '[Booking Types] LOAD_BOOKING_TYPES';
export const LOAD_BOOKING_TYPES_SUCCESS =
  '[Booking Types] LOAD_BOOKING_TYPES_SUCCESS';
export const LOAD_BOOKING_TYPES_FAILURE =
  '[Booking Types] LOAD_BOOKING_TYPES_FAILURE';

export const loadBookings = createAction(LOAD_BOOKING_TYPES);

export const loadBookingsSuccess = createAction(
  LOAD_BOOKING_TYPES_SUCCESS,
  props<{ bookings: IBookingType[] }>()
);

export const loadBookingsFailure = createAction(
  LOAD_BOOKING_TYPES_FAILURE,
  props<{ error: string }>()
);
