import { IBooking } from '../interfaces/booking.interface';
import { IBookingType } from '../interfaces/bookingType.interface';
import { IVehicle } from '../interfaces/vehicle.interface';
import { Drivers } from '../interfaces/drivers.interface';
import { Passenger } from '../interfaces/passenger.interface';
import { Note } from '../interfaces/note.interface';

export interface AppState {
  readonly bookings: IBooking[];
  readonly getBookingTypes: IBookingType[];
  readonly vehicles: IVehicle[];
  readonly drivers: Drivers;
  readonly passengers: Passenger;
  readonly note: Note;
  readonly bacUrl: string;
}
