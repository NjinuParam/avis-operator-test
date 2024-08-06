export interface ICoordinate {
  Latitude: number;
  Longitude: number;
}

export interface IAddress {
  LocationType: string;
  Name: string;
  Suburb: string;
  Town: string;
  coordinate: ICoordinate;
  StreetBuildingName: string;
  StreetBuildingNumber: number;
  StreetNumber: number;
  StreetNumberExt: string;
  AirportIsArrival: boolean;
  AirportIsDomestic: boolean;
  AirportExpectedFlightTime: string;
  AirportFlightNumber: string;
  ProvinceName: string;
  MeetingArea: string;
}

export interface ILeg {
  RequestGuid: string;
  LegNumber: number;
  RateIdentifier: string;
  RateNumber: string;
  ServiceTypeCode: string;
  CollectionDateTime: string;
  DestinationDateTime: string;
  CollectionAddress: IAddress;
  DestinationAddress: IAddress;
  Pax: number;
  VehicleCode: string;
  Remarks: string;
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
}

export interface IBooking {
  bookingNumber: string;
  quoteNumber: string;
  billingContact: {
    Email: string;
    LandLineNumber: {
      InternationalDialingCode: string;
      Number: string;
    };
  };
  Iata: string;
  roseNumber: string;
  legs: {
    Leg: ILeg[];
  };
  collectionAddress: IAddress;
  destinationAddress: IAddress;
  passengerName: string;
  passengerSurname: string;
  passengerMobile: {
    InternationalDialingCode: string;
    Number: string;
  };
}
