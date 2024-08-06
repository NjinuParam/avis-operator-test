import { createReducer, on } from '@ngrx/store';
import { IBooking, IBookingView } from 'src/app/interfaces/booking.interface';
import {
  addBooking,
  removeBooking,
  loadBookings,
  loadBookingsSuccess,
  loadBookingsFailure,
  addToInprogressBookings,
  removeBookingFromInProgressBookings,
  addToSummaryBookings,
  resetBookings,
  clearInprogressBookings,
  setUpcomingBookings,
  setBackUrl,
} from './bookings.actions';
import * as moment from 'moment';

export interface BookingsState {
  //API Bookings
  allBookings: IBookingView[];
  //current leg
  selectedBooking: any | null;
  //currentBooking
  inProgressBookings: any[];
  summaryBookings: any[];
  upcomingBookings: any[];
  error: string | null;
  status: 'pending' | 'loading' | 'error' | 'success';
}

export const initialState: BookingsState = {
  allBookings: [],
  error: null,
  selectedBooking: null,
  inProgressBookings: [],
  summaryBookings: [],
  upcomingBookings: [],
  status: 'pending',
};

export const bookingsReducer = createReducer(
  initialState,
  on(addBooking, (state, { booking }) => {
    const appBookingId =
      booking && booking?.appBookingId
        ? booking?.appBookingId
        : new Date().getTime();
    return {
      ...state,
      selectedBooking: !booking
        ? booking
        : {
            ...booking,
            appBookingId,
          },
    };
  }),
  on(removeBooking, (state) => ({
    ...state,
    selectedBooking: null,
  })),
  on(addToInprogressBookings, (state, { booking }) => ({
    ...state,
    inProgressBookings: [...state.inProgressBookings, booking],
  })),
  on(removeBookingFromInProgressBookings, (state, { booking }) => ({
    ...state,
    inProgressBookings: state.inProgressBookings.filter(
      (b) => b.appBookingId != booking.appBookingId
    ),
  })),
  on(loadBookings, (state) => ({
    ...state,
    status: 'loading',
  })),
  on(loadBookingsSuccess, (state, { bookings }) => ({
    ...state,
    allBookings: bookings,
  })),
  on(addToSummaryBookings, (state, { booking }) => ({
    ...state,
    summaryBookings: [booking],
  })),
  on(resetBookings, (state) => ({
    ...state,
    allBookings: [],
    selectedBooking: null,
    inProgressBookings: [],
    summaryBookings: [],
  })),
  on(clearInprogressBookings, (state) => ({
    ...state,
    inProgressBookings: [],
  })),
  on(setUpcomingBookings, (state, { bookings }) => ({
    ...state,
    upcomingBookings: [...bookings],
  })),
  on(setBackUrl, (state, { booking }) => ({
    ...state,
    selectedBooking: booking,
  }))
);
