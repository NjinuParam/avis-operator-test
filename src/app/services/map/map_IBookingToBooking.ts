import { IAddress, IBooking, ICoordinate, ILeg } from './Booking';
import {
  _IBooking,
  _IBookingLeg,
  _IAddress,
  _IVehicleFee,
  _IVehicleExtra,
  _IVehicle,
  _ISelectedAccessory,
  _ICustomer,
  _ICoordinate,
} from './_IBooking'; // Import the required interfaces

export function mapBooking(_booking: _IBooking): IBooking {
  // Map the legs
  const legs: ILeg[] = _booking.legs.map((leg, index) => {
    return mapBookingLeg(leg, index);
  });

  // Map the customer
  // const customer: ICustomer = mapCustomer(_booking.customer);

  // Create the IBooking object
  const booking: IBooking = {
    bookingNumber: '', // Fill in the correct value here
    quoteNumber: '', // Fill in the correct value here
    billingContact: {
      Email: '', // Fill in the correct value here
      LandLineNumber: {
        InternationalDialingCode: '', // Fill in the correct value here
        Number: '', // Fill in the correct value here
      },
    },
    Iata: '', // Fill in the correct value here
    roseNumber: '', // Fill in the correct value here
    legs: { Leg: legs },
    collectionAddress: mapAddress(
      _booking.legs[0]?.collectionAddress,
      _booking.legs[0]
    ),
    destinationAddress: mapAddress(
      _booking.legs[0]?.collectionAddress,
      _booking.legs[0]
    ),
    passengerName: '', // Fill in the correct value here
    passengerSurname: '', // Fill in the correct value here
    passengerMobile: {
      InternationalDialingCode: '', // Fill in the correct value here
      Number: '', // Fill in the correct value here
    },
  };

  return booking;
}

function mapBookingLeg(_leg: _IBookingLeg, index: number): ILeg {
  // Map the addresses
  const collectionAddress: IAddress = mapAddress(_leg?.collectionAddress, _leg);
  const destinationAddress: IAddress = mapAddress(
    _leg?.destinationAddress,
    _leg
  );

  // Create the ILeg object
  const leg: ILeg = {
    RequestGuid: '',
    LegNumber: index,
    RateIdentifier: _leg.rateIdentifier,
    RateNumber: _leg.rateNumber,
    ServiceTypeCode: _leg.bookingType?.id.toString(),
    CollectionDateTime: _leg.collectionDateTime,
    DestinationDateTime: _leg.destinationDateTime,
    CollectionAddress: collectionAddress,
    DestinationAddress: destinationAddress,
    Pax: _leg.pax,
    VehicleCode: _leg.vehicle.code,
    Remarks: _leg.note,
    WizardRateCode: '',
    VehicleTypeDescription: _leg.vehicle?.description,
    VehiclePax: _leg.pax,
    IsNettRate: false, // Convert to boolean
    IsConfidential: false, // Convert to boolean
    IsProforma: false, // Convert to boolean
    LegStatus: '',
    ZoneCode: 0, // Convert to number
    ZoneDescription: '',
    DailyFreeKms: 0, // Convert to number
    RateTypeDescription: _leg.rateIdentifier,
    ServiceTypeDescription: _leg.bookingType?.description,
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
    ExternallyChanged: false, // Convert to boolean
  };

  return leg;
}

function mapAddress(_address: _IAddress, leg: _IBookingLeg): IAddress {
  // Map the coordinates
  const coordinate: ICoordinate = mapCoordinate(_address?.coordinate);

  // Create the IAddress object
  const address: IAddress = {
    LocationType: _address?.locationType,
    Name: _address.name,
    Suburb: _address.suburb,
    Town: _address.town,
    coordinate: coordinate,
    StreetBuildingName: _address.name,
    StreetBuildingNumber: 0, // Convert to number
    StreetNumber: 0, // Convert to number
    StreetNumberExt: '',
    AirportIsArrival: leg.isAirportDropOff, // Convert to boolean
    AirportIsDomestic: leg.isAirportDropOff, // Convert to boolean
    AirportExpectedFlightTime: leg.collectionDateTime,
    AirportFlightNumber: leg.pickupflightno??"00",
    ProvinceName: leg.collectionAddress.town,
    MeetingArea: '',
  };

  return address;
}

function mapCoordinate(_coordinate: _ICoordinate): ICoordinate {
  // Create the ICoordinate object
  const coordinate: ICoordinate = {
    Latitude: _coordinate.latitude,
    Longitude: _coordinate.longitude,
  };

  return coordinate;
}
