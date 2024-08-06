import { createReducer, on } from '@ngrx/store';
import { IBooking } from 'src/app/interfaces/booking.interface';
import { IBookingType } from 'src/app/interfaces/bookingType.interface';
import {
  loadBookings,
  loadBookingsSuccess,
  loadBookingsFailure,
} from './bookingTypes.actions';

export interface BookingTypeState {
  bookingTypes: IBookingType[];
  error: string | null;
  status: 'pending' | 'loading' | 'error' | 'success';
}

export const initialState: BookingTypeState = {
  bookingTypes: [
    {
      id: 1,
      name: 'Luxury Cars',
      description: 'Self-Drive Car Rental',
      avisCode: 'AVIS LUXURY CARS',
    },
    {
      id: 2,
      name: 'Point 2 Point',
      description: 'Transfer From Point A To Point B',
      avisCode: 'CHAUFFEUR DRIVE TRANSFER',
    },
    {
      id: 3,
      name: 'Chauffeur Drive',
      description: 'Chauffeur & Vehicle At Your Disposal',
      avisCode: 'CHAUFFEUR DRIVE DISPOSAL',
    },
  ],
  error: null,
  status: 'pending',
};

export const bookingTypesReducer = createReducer(initialState);
