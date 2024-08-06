import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IAirport } from '../interfaces/airport.interface';
import { FirebaseApp } from '@angular/fire/app';
import { IBooking } from '../interfaces/booking.interface';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  currentQuoteId: string = '';
  currentBookingId: string = '';

  getQuote(quoteNumber: string) {
    return this.http.get(`${this.baseUrl}quote/${quoteNumber}&false`);
  }
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient, private fApp: FirebaseApp) {}

  getBookingsByBookingId(id: string) {
    return this.http.get(`${this.baseUrl + environment.api.bookings}/${id}`);
  }

  submitEnquiry(enquiry: any) {
    return this.http.post(this.baseUrl + environment.api.vehicleRates, enquiry);
  }

  getBookingEnquiry(bookingNumber: string, leg: string) {
    return this.http.get(
      `${
        this.baseUrl + environment.api.bookings
      }/lastEnquiry/${bookingNumber}/${leg}`
    );
  }

  logEnquiry(value: any) {
    return this.http.post(
      `${this.baseUrl + environment.api.bookings}/enquiry`,
      value
    );
  }

  getAvailableAirports() {
    return this.http.get<IAirport[]>(this.baseUrl + environment.api.airports);
  }

  getInvoice(bookingId:string, stageNumber: string) {
    return this.http.get<any>(`${this.baseUrl}document/invoice/${bookingId}/${stageNumber}`);
  }

  getVehicleRates(payload: any) {
    return this.http.post(this.baseUrl + environment.api.vehicleRates, payload, {headers:{'Content-Type': 'application/json'}});
  }
  postBooking(payload: any) {
    return this.http.post(`${this.baseUrl}booking/`, payload, {headers:{'Content-Type': 'application/json'}});
  }
  postQuote(payload: any) {
    return this.http.post(`${this.baseUrl}quote/`, payload, {headers:{'Content-Type': 'application/json'}});
  }
 
  postAddQuoteDocuments(payload: FormData) {
    const options = {} as any;
    return this.http.post(`${this.baseUrl}saveLicence`,payload);
  }
  postAddDocuments(payload: FormData) {
    return this.http.post(`${this.baseUrl}document/`, payload, );
  }

  getTermsAndConditions() {
    return this.http.get(`${this.baseUrl}document/termsandconditions/`, {headers:{'Content-Type': 'application/json'}});
  }

  getQuoteTerms(id: string) {
    return this.http.get(`${this.baseUrl}Quote/terms/${id}`, {headers:{'Content-Type': 'application/json'}});
  }
  // getBookings() {
  //   //TODO add user id here
  //   const userId = 'abc123';
  //   return this.http.get(
  //     `${this.baseUrl + environment.api.loadBookings}${userId}`
  //   );
  // }
  getBookingManifestByCustomerCode(customerCode: string) {
    return this.http.get(
      `${
        this.baseUrl + environment.api.bookings
      }/customer/booking/manifest/cc/${customerCode}`
    , {headers:{'Content-Type': 'application/json'}});
  }
  cancelBooking(bookingId: string, surname: string) {
    return this.http.delete(
      `${this.baseUrl + environment.api.bookings}/${bookingId}/${surname}`, {headers:{'Content-Type': 'application/json'}}
    );
  }
  populateBookingData(data: _BookingData): BookingData {
    const bookingData: BookingData = {
      bookingNumber: data.bookingNumber,
      quoteNumber: data.quoteNumber,
      billingContact: {
        Email: data?.bookingLegs[0].customer.email,
        LandLineNumber: {
          InternationalDialingCode:
            data?.bookingLegs[0]?.customer?.mobileIntDial ?? '',
          Number: data?.bookingLegs[0]?.customer?.landline ?? '',
        },
      },
      Iata: '1221',
      roseNumber: data?.bookingLegs[0]?.customer?.roseNumber,
      legs: {
        Leg: data.bookingLegs.map((x, i) => this.populateLeg(x, i)),
      },

      collectionAddress: this.populateAddress(
        data.bookingLegs[0].collectionAddress,
        data.bookingLegs[0].IsAirportPickUp
      ),
      destinationAddress: this.populateAddress(
        data.bookingLegs[0].destinationAddress,
        data.bookingLegs[0].IsAirportDropOff
      ),
      passengerName: data?.passengerName ?? '',
      passengerSurname: data?.passengerSurname ?? '',
      passengerMobile: {
        InternationalDialingCode:
          data?.passengerMobile?.internationalDialingCode ?? '',
        Number: data?.passengerMobile?.number ?? '',
      },
      customer: data.customer,
    };

    return bookingData;
  }
  populateAddress(address: _IAddress, isAirport: boolean): IAddress {
    
    const populatedAddress: IAddress = {
      LocationType: isAirport ? 'AIRPORT' : 'STREET',
      Name: address.name,
      Suburb: address.suburb,
      Town: address.town,
      coordinate: {
        Latitude: address?.coordinate?.latitude,
        Longitude: address?.coordinate?.longitude,
      },
      StreetBuildingName: isAirport
        ? address.name
        : address?.streetBuildingName,
      StreetBuildingNumber: isAirport
        ? '0'
        : address.streetBuildingNumber?.toString(),
      StreetNumber: isAirport ? '0' : address?.streetNumber?.toString(),
      StreetNumberExt: '',
      AirportIsArrival: false,
      AirportIsDomestic: false,
      AirportExpectedFlightTime: '',
      AirportFlightNumber: address?.airportFlightNumber,
      ProvinceName: address?.province,
      MeetingArea: '',
    };

    return populatedAddress;
  }
  populateLeg(leg: _BookingLeg, index: number): ILeg {
    const identifier =
      leg.bookingType.id == 2 ? 'P2P' : leg.bookingType.id == 3 ? 'CDD' : 'ALC';
    if (leg.additionalDrivers) {
      leg.additionalDrivers.forEach((driver: any) => {
        (driver.stageNumber = index.toString()),
          (driver.lineNumber = index.toString());
      });
    }

    
    const populatedLeg: ILeg = {
      BookingType: {
        id: leg.bookingType.id,
        name: identifier,
      },
      additionalDrivers: leg.additionalDrivers ?? [],
      RequestGuid: '',
      LegNumber: index,
      RateIdentifier: leg.rateIdentifier,
      RateNumber: leg.rateNumber,
      ServiceTypeCode: leg.vehicle.serviceType,
      CollectionDateTime: leg.collectionDateTime,
      DestinationDateTime: leg.destinationDateTime,
      CollectionAddress: this.populateAddress(
        leg.collectionAddress,
        leg.IsAirportPickUp
      ),
      DestinationAddress: this.populateAddress(
        leg.destinationAddress,
        leg.IsAirportDropOff
      ),
      SelectedAccessories: leg.selectedAccessories,
      Pax: leg.passengers ? leg.passengers.length : 1,
      VehicleCode: leg.vehicle.code,
      Remarks: leg.note,
      Note: leg.note,
      WizardRateCode: '',
      VehicleTypeDescription: leg.vehicle?.description,
      VehiclePax: Number(leg.vehicle?.maxPassengers),
      IsNettRate: false,
      IsConfidential: false,
      IsProforma: false,
      LegStatus: '',
      ZoneCode: 0,
      ZoneDescription: '',
      DailyFreeKms: 0,
      RateTypeDescription: '',
      ServiceTypeDescription: '',
      Inclusions: '',
      Exclusions: '',
      PoiDescription: '',
      PoiDescriptionTo: '',
      WizardTypeCode: '',
      RateTimeDescription: '',
      FuelCharge: '',
      CollDamageWaiverDescription: '',
      TheftLossWaiverDescription: '',
      PAIDescription: '',
      MinimumValidDays: '',
      MaximumValidDays: '',
      KMRate: '',
      ResponsibilityAmount: '',
      RateBreakdownDescription: '',
      SpecialRequests: '',
      RateTypeCode: '',
      RateHubCode: '',
      CustomerProfileDesc: '',
      VehicleTypeAndWizCode: '',
      HoursRate: '',
      ExternallyChanged: false,

      passengers: leg.passengers ?? [],
    };

    return populatedLeg;
  }
}

///////INTERFACES
interface ICoordinate {
  Latitude: number;
  Longitude: number;
}

interface IAddress {
  LocationType: string;
  Name: string;
  Suburb: string;
  Town: string;
  coordinate: ICoordinate;
  StreetBuildingName: string;
  StreetBuildingNumber: string;
  StreetNumber: string;
  StreetNumberExt: string;
  AirportIsArrival: boolean;
  AirportIsDomestic: boolean;
  AirportExpectedFlightTime: string;
  AirportFlightNumber: string;
  ProvinceName: string;
  MeetingArea: string;
}

interface IContact {
  Email: string;
  LandLineNumber: {
    InternationalDialingCode: string;
    Number: string;
  };
}

interface ILeg {
  BookingType: any;
  RequestGuid: string;
  additionalDrivers: [];
  LegNumber: number;
  RateIdentifier: string;
  RateNumber: string;
  ServiceTypeCode: string;
  CollectionDateTime: string;
  DestinationDateTime: string;
  CollectionAddress: IAddress;
  DestinationAddress: IAddress;
  SelectedAccessories: any[];
  Pax: number;
  VehicleCode: string;
  Remarks: string;
  Note: string;
  WizardRateCode: string;
  VehicleTypeDescription: string;
  VehiclePax: number;
  IsNettRate: boolean;
  IsConfidential: boolean;
  IsProforma: boolean;
  LegStatus: string;
  ZoneCode: number;
  ZoneDescription: string;
  DailyFreeKms: number;
  RateTypeDescription: string;
  ServiceTypeDescription: string;
  Inclusions: string;
  Exclusions: string;
  PoiDescription: string;
  PoiDescriptionTo: string;
  WizardTypeCode: string;
  RateTimeDescription: string;
  FuelCharge: string;
  CollDamageWaiverDescription: string;
  TheftLossWaiverDescription: string;
  PAIDescription: string;
  MinimumValidDays: string;
  MaximumValidDays: string;
  KMRate: string;
  ResponsibilityAmount: string;
  RateBreakdownDescription: string;
  SpecialRequests: string;
  RateTypeCode: string;
  RateHubCode: string;
  CustomerProfileDesc: string;
  VehicleTypeAndWizCode: string;
  HoursRate: string;
  ExternallyChanged: boolean;
  passengers: any[];
}

interface PassengerMobile {
  InternationalDialingCode: string;
  Number: string;
}

export interface BookingData {
  bookingNumber: string;
  quoteNumber: string;
  billingContact: IContact;
  Iata: string;
  roseNumber: string;
  legs: {
    Leg: ILeg[];
  };
  collectionAddress: IAddress;
  destinationAddress: IAddress;
  passengerName: string;
  passengerSurname: string;
  passengerMobile: PassengerMobile;
  customer: any;
}

////

interface _ICoordinate {
  latitude: number;
  longitude: number;
}

interface _ICustomer {
  title: string;
  custId: string;
  custIdPassport: string;
  custFullNames: string;
  custSurname: string;
  dateOfBirth: string;
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

interface _IFee {
  priceUnit: string;
  price: string;
  feeType: string;
  calculatedDistance: string;
  calculatedTime: string;
}

interface _IFeeBreakdown {
  fee: _IFee[];
}

interface _IVehicleExtra {
  code: string;
  description: string;
  maxAllowed: string;
  price: string;
  isReadOnly: string;
}

interface _IImage {
  name: string;
  storageUrl: string;
  id: string;
  dateCreated: string;
  dateUpdated: string;
}

interface _IVehicle {
  code: string;
  description: string;
  doors: string;
  maxPassengers: string;
  isAvailable: string;
  fee: _IFee;
  feeBreakdown: _IFeeBreakdown;
  suitCases: string;
  fuelType: string;
  transmissionType: string;
  vehicleExtras: {
    vehicleExtra: _IVehicleExtra[];
  };
  image: _IImage;  
  serviceType: string;
}

interface _SelectedAccessory {
  option: string;
  cost: string;
  qty: number;
}

interface _IAddress {
  coordinate: _ICoordinate;
  locationType: string;
  name: string;
  suburb: string;
  town: string;
  streetNumber: number;
  province: string;
  streetAddress: string;
  streetBuilding: string;
  streetBuildingName: string;
  streetBuildingNumber: number;
  airportFlightNumber: string;
}

interface _Passenger {
  Name: string;
  Lastname: string;
  idNumber: string;
  driversLicence: string;
}

interface _BookingLeg {
  customer: _ICustomer;
  bookingType: {
    id: number;
    name: string;
  };
  pickUp: string;
  dropOff: string;
  pickUpFlightNumber: string;
  dropOffFlightNumber: string;
  dropOffDate: string;
  pickUpDate: string;
  IsAirportPickUp: boolean;
  IsAirportDropOff: boolean;
  collectionAddress: _IAddress;
  collectionDateTime: string;
  destinationAddress: _IAddress;
  destinationDateTime: string;
  pax: number;
  rateIdentifier: string;
  rateNumber: string;
  vehicle: _IVehicle;
  selectedAccessories: _SelectedAccessory[];
  passengers: _Passenger[];
  _uploadFiles: any[];
  note: string;
  additionalDrivers: [];
}

interface _PassengerMobile {
  internationalDialingCode: string;
  number: string;
}

export interface _BookingData {
  quoteNumber: string;
  bookingNumber: string;
  frequentFlierNumber: string;
  isIndividual: boolean;
  luxuryClubNumber: string;
  vatNumber: string;
  bookingLegs: _BookingLeg[];
  passengerName: string;
  passengerSurname: string;
  passengerEmail: string;
  passengerWizardNo: string;
  passengerMobile: _PassengerMobile;
  customer: _ICustomer;
}
