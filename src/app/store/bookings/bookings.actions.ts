import { createAction, props } from '@ngrx/store';
import { IBooking } from 'src/app/interfaces/booking.interface';

export const ADD_BOOKING = '[Booking] ADD_BOOKING';
export const REMOVE_BOOKING = '[Booking] REMOVE_BOOKING';
export const LOAD_BOOKINGS = '[Booking] LOAD_BOOKINGS';
export const LOAD_BOOKINGS_SUCCESS = '[Booking] LOAD_BOOKINGS_SUCCESS';
export const LOAD_BOOKINGS_FAILURE = '[Booking] LOAD_BOOKINGS_FAILURE';
export const ADD_TO_IN_PROGRESS_BOOKINGS =
  '[Booking] ADD_TO_IN_PROGRESS_BOOKINGS';
export const REMOVE_BOOKING_FROM_IN_PROGRESS_BOOKINGS =
  '[Booking] REMOVE_BOOKING_FROM_IN_PROGRESS_BOOKINGS';
export const ADD_TO_SUMMARY_BOOKINGS = '[Booking] ADD_TO_SUMMARY_BOOKINGS';
export const RESET_BOOKINGS = '[Booking] RESET_BOOKINGS';
export const CLEAR_INPROGRESS_BOOKINGS = '[Booking] CLEAR_INPROGRESS_BOOKINGS';
export const SET_UPCOMING_BOOKINGS = '[Booking] SET_UPCOMING_BOOKINGS';
export const SET_NOTE_BACK_URL = '[Booking] SET_NOTE_BACK_URL';

export const addBooking = createAction(ADD_BOOKING, props<{ booking: any }>());
export const addToInprogressBookings = createAction(
  ADD_TO_IN_PROGRESS_BOOKINGS,
  props<{ booking: any }>()
);
export const removeBookingFromInProgressBookings = createAction(
  REMOVE_BOOKING_FROM_IN_PROGRESS_BOOKINGS,
  props<{ booking: any }>()
);
export const removeBooking = createAction(
  REMOVE_BOOKING,
  props<{ id: string }>()
);

export const loadBookings = createAction(LOAD_BOOKINGS);

export const loadBookingsSuccess = createAction(
  LOAD_BOOKINGS_SUCCESS,
  props<{ bookings: any }>()
);

export const loadBookingsFailure = createAction(
  LOAD_BOOKINGS_FAILURE,
  props<{ error: string }>()
);
export const addToSummaryBookings = createAction(
  ADD_TO_SUMMARY_BOOKINGS,
  props<{ booking: any }>()
);
export const setBackUrl = createAction(
  SET_NOTE_BACK_URL,
  props<{ booking: any }>()
);
export const setUpcomingBookings = createAction(
  SET_UPCOMING_BOOKINGS,
  props<{ bookings: any[] }>()
);
export const resetBookings = createAction(RESET_BOOKINGS);
export const clearInprogressBookings = createAction(CLEAR_INPROGRESS_BOOKINGS);
