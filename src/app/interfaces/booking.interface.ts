import { IBookingType } from './bookingType.interface';
import { IVehicle } from './vehicle.interface';

export interface IBooking {
  vehicle?: IVehicle;
  pickUp?: string;
  dropOff?: string;
  pickUpDate?: string;
  dropOffDate?: string;
  additionDrivers?: number;
  status?: string;
  bookingType?: IBookingType;
  flightNumber?: string;
  hide?: boolean;
}


export interface IBookingView {
  legs: IBooking[],
  bookingId:string,
  orderNumber:string,
  customer:any
}

export interface IDocument{
  name?: string,
  fileType?: string,
  document?: string,
  userId?: string,
  wizardNumber?: string,
  bookingId?:string
}
export interface IDocumentUpload extends IDocument{
  _file:Blob
}