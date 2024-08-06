import { createReducer, on } from '@ngrx/store';

import { setDrivers } from './drivers.actions';
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
};

  export const driversReducer = createReducer(
    initialState,
    on(setDrivers, (state, { drivers }) => ({ ...state, drivers }))
  );

