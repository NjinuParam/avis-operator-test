import { createReducer, on } from '@ngrx/store';
import { addPassenger } from './passengers.actions'; 
import { AppState } from '../app.state';

const initialState: AppState = {
    drivers: {
        firstName: '',
        lastName: '',
        licenceNumber: '',
        idNumber: 0,
        note: ''
    },
    bookings: [],
    getBookingTypes: [],
    vehicles: [],
    passengers: {
        firstName: '',
        lastName: '',
        contacts: '',
        note: ''
    },
    note:{
        note:''
    }
}

export const passengerReducer = createReducer(
    initialState,
    on(addPassenger, (state, { passenger }) => ({ ...state, passenger }))
  );