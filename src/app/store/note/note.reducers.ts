import { createReducer, on } from '@ngrx/store';
import { addNote, noteBackUrl } from './note.actions';
import { AppState } from '../app.state';

const initialState: AppState = {
  drivers: {
    firstName: '',
    lastName: '',
    licenceNumber: '',
    idNumber: 0,
    note: '',
  },
  bookings: [],
  getBookingTypes: [],
  vehicles: [],
  passengers: {
    firstName: '',
    lastName: '',
    contacts: '',
    note: '',
  },
  note: {
    note: '',
  },
  bacUrl: '',
};

export const noteReducer = createReducer(
  initialState,
  on(addNote, (state, { note }) => ({ ...state, note })),
  on(noteBackUrl, (state, { url }) => ({ ...state, bacUrl: url }))
);
