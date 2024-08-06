export interface _ICoordinate {
  latitude: number;
  longitude: number;
}

export interface _IAddress {
  coordinate: _ICoordinate;
  locationType: string;
  name: string;
  suburb: string;
  town: string;
}

export interface _IVehicleFee {
  priceUnit: string;
  price: string;
  feeType: string;
  calculatedDistance: string;
  calculatedTime: string;
}

export interface _IVehicleExtra {
  code: string;
  description: string;
  maxAllowed: string;
  price: string;
  isReadOnly: string;
}

export interface _IVehicle {
  code: string;
  description: string;
  doors: string;
  maxPassengers: string;
  isAvailable: string;
  fee: _IVehicleFee;
  feeBreakdown: { fee: _IVehicleFee[] };
  suitCases: string;
  fuelType: string;
  transmissionType: string;
  vehicleExtras: { vehicleExtra: _IVehicleExtra[] };
  image: {
    name: string;
    storageUrl: string;
    id: string;
    dateCreated: string;
    dateUpdated: string;
  };
}

export interface _IPassenger {
  firstName: string;
  lastName: string;
  contacts: string;
  note: string;
  idNumber: string;
}

export interface _ISelectedAccessory {
  option: string;
  cost: string;
  qty: number;
  code: string;
}

export interface _IBookingType {
  id: number;
  name: string;
  description: string;
}

export interface _IBookingLeg {
  bookingType: _IBookingType;
  id: string;
  pickUp: string;
  dropOff: string;
  pickUpAirport: string;
  dropOffAirport: string;
  pickupflightno: string;
  dropoffflightno: string;
  dropOffDate: string;
  pickUpDate: string;
  collectionAddress: _IAddress;
  collectionDateTime: string;
  destinationAddress: _IAddress;
  destinationDateTime: string;
  pax: number;
  rateIdentifier: string;
  rateNumber: string;
  isAirportDropOff: boolean;
  isAirportPickUp: boolean;
  vehicle: _IVehicle;
  selectedAccessories: _ISelectedAccessory[];
  passengers: _IPassenger[];
  additionalDrivers: _IPassenger[];
  _uploadFiles: any[]; // This should be updated to the correct type if possible
  note: string;
}

export interface _ICustomer {
  title: string;
  custId: string;
  custIdPassport: string;
  custFullNames: string;
  custSurname: string;
  dateOfBirth: string; // This should ideally be a Date type, but since the provided data is in string format, we'll keep it as a string for now.
  cellphone: string;
  email: string;
  driversLicense: string;
  creditCardNumber: string;
  creditCardExpiry: string;
  creditCardType: string;
  vatReg: string;
  luxClubNumber: string;
  wizardNumber: string;
  contactPerson: string;
  landline: string;
  billAddress1: string;
  billAddress2: string;
  mobileIntDial: string;
  frequentFlier: string;
  roseNumber: string;
  custEmployer: string;
  licPpnNumber: string;
}

export interface _IBooking {
  legs: _IBookingLeg[];
  customer: _ICustomer;
}
